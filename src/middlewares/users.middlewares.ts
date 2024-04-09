import { Request } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import capitalize from 'lodash/capitalize'

import { ENV_CONFIG } from '~/constants/config'
import { HttpStatusCode } from '~/constants/enum'
import { USER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

const emailSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
  },
  isEmail: {
    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
  }
}

const passwordSchema: ParamSchema = {
  trim: true,
  isLength: {
    options: {
      min: 8,
      max: 32
    },
    errorMessage: USER_MESSAGES.PASSWORD_LENGTH_IS_INVALID
  },
  isStrongPassword: {
    options: {
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USER_MESSAGES.PASSWORD_IS_NOT_STRONG_ENOUGH
  }
}

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const token = (value || '').split(' ')[1]
            if (!token) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decodedAuthorization = await verifyToken({
                token,
                secretOrPublicKey: ENV_CONFIG.JWT_ACCESS_TOKEN_SECRET
              })
              ;(req as Request).decodedAuthorization = decodedAuthorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HttpStatusCode.Unauthorized
              })
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string) => {
            const email = await databaseService.users.findOne({ email: value })
            if (email) {
              throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirmPassword: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        custom: {
          options: (value, { req }) => {
            const password = req.body.password
            if (value !== password) {
              throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: emailSchema,
      password: {
        ...passwordSchema,
        custom: {
          options: async (value, { req }) => {
            const email = req.body.email
            const user = await databaseService.users.findOne(
              {
                email,
                password: hashPassword(value)
              },
              {
                projection: {
                  password: 0,
                  avatar: 0,
                  phoneNumber: 0,
                  verifyEmailToken: 0,
                  forgotPasswordToken: 0,
                  addresses: 0,
                  status: 0,
                  role: 0,
                  verify: 0
                }
              }
            )
            if (!user) {
              throw new Error(USER_MESSAGES.PASSWORD_OR_EMAIL_IS_INCORRECT)
            }
            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)
