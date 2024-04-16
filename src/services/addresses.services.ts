import { ObjectId } from 'mongodb'

import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import Address from '~/models/schemas/Address.schema'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

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

  async delete({ addressId, userId }: { addressId: string; userId: string }) {
    await Promise.all([
      databaseService.addresses.deleteOne({ _id: new ObjectId(addressId) }),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $pull: {
            addresses: new ObjectId(addressId)
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return true
  }

  async getAll({ query, userId }: { query: PaginationReqQuery; userId: string }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { userId: new ObjectId(userId) }
    const [addresses, totalRows] = await Promise.all([
      databaseService.addresses
        .aggregate([
          {
            $match: match
          },
          {
            $lookup: {
              from: 'provinces',
              localField: 'provinceId',
              foreignField: '_id',
              as: 'province'
            }
          },
          {
            $unwind: {
              path: '$province'
            }
          },
          {
            $addFields: {
              district: {
                $filter: {
                  input: '$province.districts',
                  as: 'district',
                  cond: {
                    $eq: ['$$district.id', '$districtId']
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: '$district'
            }
          },
          {
            $addFields: {
              ward: {
                $filter: {
                  input: '$district.wards',
                  as: 'ward',
                  cond: {
                    $eq: ['$$ward.id', '$wardId']
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: '$ward'
            }
          },
          {
            $addFields: {
              street: {
                $filter: {
                  input: '$district.streets',
                  as: 'street',
                  cond: {
                    $eq: ['$$street.id', '$streetId']
                  }
                }
              }
            }
          },
          {
            $unwind: {
              path: '$street',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $group: {
              _id: '$_id',
              fullName: {
                $first: '$fullName'
              },
              phoneNumber: {
                $first: '$phoneNumber'
              },
              type: {
                $first: '$type'
              },
              province: {
                $first: '$province'
              },
              district: {
                $first: '$district'
              },
              ward: {
                $first: '$ward'
              },
              street: {
                $first: '$street'
              },
              specificAddress: {
                $first: '$specificAddress'
              },
              isDefault: {
                $first: '$isDefault'
              },
              createdAt: {
                $first: '$createdAt'
              },
              updatedAt: {
                $first: '$updatedAt'
              }
            }
          },
          {
            $project: {
              'province._id': 0,
              'province.id': 0,
              'province.districts': 0,
              'district.id': 0,
              'district.wards': 0,
              'district.streets': 0,
              'district.projects': 0,
              'ward.id': 0,
              'street.id': 0
            }
          },
          {
            $sort: {
              createdAt: -1
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.addresses.countDocuments(match)
    ])
    return {
      addresses,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async getOne(addressId: string) {
    const addresses = await databaseService.addresses
      .aggregate([
        {
          $match: {
            _id: new ObjectId(addressId)
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'provinceId',
            foreignField: '_id',
            as: 'province'
          }
        },
        {
          $unwind: {
            path: '$province'
          }
        },
        {
          $addFields: {
            district: {
              $filter: {
                input: '$province.districts',
                as: 'district',
                cond: {
                  $eq: ['$$district.id', '$districtId']
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$district'
          }
        },
        {
          $addFields: {
            ward: {
              $filter: {
                input: '$district.wards',
                as: 'ward',
                cond: {
                  $eq: ['$$ward.id', '$wardId']
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$ward'
          }
        },
        {
          $addFields: {
            street: {
              $filter: {
                input: '$district.streets',
                as: 'street',
                cond: {
                  $eq: ['$$street.id', '$streetId']
                }
              }
            }
          }
        },
        {
          $unwind: {
            path: '$street',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            _id: '$_id',
            fullName: {
              $first: '$fullName'
            },
            phoneNumber: {
              $first: '$phoneNumber'
            },
            type: {
              $first: '$type'
            },
            province: {
              $first: '$province'
            },
            district: {
              $first: '$district'
            },
            ward: {
              $first: '$ward'
            },
            street: {
              $first: '$street'
            },
            specificAddress: {
              $first: '$specificAddress'
            },
            isDefault: {
              $first: '$isDefault'
            },
            createdAt: {
              $first: '$createdAt'
            },
            updatedAt: {
              $first: '$updatedAt'
            }
          }
        },
        {
          $project: {
            'province._id': 0,
            'province.id': 0,
            'province.districts': 0,
            'district.id': 0,
            'district.wards': 0,
            'district.streets': 0,
            'district.projects': 0,
            'ward.id': 0,
            'street.id': 0
          }
        }
      ])
      .toArray()
    return {
      address: addresses[0]
    }
  }

  async getAllProvinces() {
    const provinces = await databaseService.provinces
      .find(
        {},
        {
          projection: {
            id: 0,
            districts: 0
          }
        }
      )
      .toArray()
    return {
      provinces,
      totalRows: provinces.length
    }
  }

  async getDistrictsByProvinceId(provinceId: string) {
    const districts = await databaseService.provinces
      .aggregate([
        {
          $match: {
            _id: new ObjectId(provinceId)
          }
        },
        {
          $unwind: {
            path: '$districts'
          }
        },
        {
          $replaceRoot: {
            newRoot: '$districts'
          }
        },
        {
          $project: {
            wards: 0,
            streets: 0,
            projects: 0
          }
        }
      ])
      .toArray()
    return {
      districts,
      totalRows: districts.length
    }
  }
}

const addressService = new AddressService()
export default addressService
