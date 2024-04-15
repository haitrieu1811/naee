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
}

const addressService = new AddressService()
export default addressService
