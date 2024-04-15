import { Request } from 'express'
import { checkSchema } from 'express-validator'
import isBoolean from 'lodash/isBoolean'
import { ObjectId } from 'mongodb'

import { AddressType, HttpStatusCode } from '~/constants/enum'
import { ADDRESS_MESSAGES } from '~/constants/message'
import { VIET_NAM_PHONE_NUMBER_REGEX } from '~/constants/regex'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const addressTypes = numberEnumToArray(AddressType)

export const createAddressValidator = validate(
  checkSchema(
    {
      fullName: {
        trim: true,
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.FULLNAME_IS_REQUIRED
        }
      },
      phoneNumber: {
        trim: true,
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.PHONE_NUMBER_IS_REQUIRED
        },
        custom: {
          options: (value: string) => {
            if (!VIET_NAM_PHONE_NUMBER_REGEX.test(value)) {
              throw new Error(ADDRESS_MESSAGES.PHONE_NUMBER_IS_INVALID)
            }
            return true
          }
        }
      },
      type: {
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.ADDRESS_TYPE_IS_REQUIRED
        },
        isIn: {
          options: [addressTypes],
          errorMessage: ADDRESS_MESSAGES.ADDRESS_TYPE_IS_INVALID
        }
      },
      provinceId: {
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.PROVINCE_ID_IS_REQUIRED
        },
        isMongoId: {
          errorMessage: ADDRESS_MESSAGES.PROVINCE_ID_IS_INVALID
        },
        custom: {
          options: async (value: string) => {
            const province = await databaseService.provinces.findOne({ _id: new ObjectId(value) })
            if (!province) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.PROVINCE_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            return true
          }
        }
      },
      districtId: {
        trim: true,
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.DISTRICT_ID_IS_REQUIRED
        },
        custom: {
          options: (value: string) => {
            if (Number.isNaN(Number(value))) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.DISTRICT_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      wardId: {
        trim: true,
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.WARD_ID_IS_REQUIRED
        },
        custom: {
          options: (value: string) => {
            if (Number.isNaN(Number(value))) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.WARD_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      streetId: {
        optional: true,
        trim: true,
        custom: {
          options: (value: string) => {
            if (Number.isNaN(Number(value))) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.STREET_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      specificAddress: {
        trim: true,
        notEmpty: {
          errorMessage: ADDRESS_MESSAGES.SPECIFIC_ADDRESS_IS_REQUIRED
        }
      },
      isDefault: {
        optional: true,
        custom: {
          options: (value: string) => {
            if (!isBoolean(value)) {
              throw new Error(ADDRESS_MESSAGES.IS_DEFAULT_MUST_BE_A_BOOLEAN)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const addressIdValidator = validate(
  checkSchema(
    {
      addressId: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.ADDRESS_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.ADDRESS_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            const address = await databaseService.addresses.findOne({ _id: new ObjectId(value) })
            if (!address) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.ADDRESS_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            const { userId } = (req as Request).decodedAuthorization as TokenPayload
            if (address.userId.toString() !== userId) {
              throw new ErrorWithStatus({
                message: ADDRESS_MESSAGES.PERMISSION_DENIED,
                status: HttpStatusCode.Forbidden
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
