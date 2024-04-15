import { ObjectId } from 'mongodb'

import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import Address from '~/models/schemas/Address.schema'
import databaseService from '~/services/database.services'

class AddressService {
  async create({ dto, userId }: { dto: CreateAddressReqBody; userId: string }) {
    const { insertedId } = await databaseService.addresses.insertOne(
      new Address({
        ...dto,
        userId: new ObjectId(userId),
        provinceId: new ObjectId(dto.provinceId)
      })
    )
    const [addedAddress] = await Promise.all([
      databaseService.addresses.findOne({ _id: insertedId }),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $push: {
            addresses: insertedId
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return {
      address: addedAddress
    }
  }

  async update({ dto, addressId }: { dto: CreateAddressReqBody; addressId: string }) {
    const dtoConfig = {
      ...dto,
      provinceId: new ObjectId(dto.provinceId)
    }
    const updatedAddress = await databaseService.addresses.findOneAndUpdate(
      {
        _id: new ObjectId(addressId)
      },
      {
        $set: dtoConfig,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      address: updatedAddress
    }
  }
}

const addressService = new AddressService()
export default addressService
