import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import capitalize from 'lodash/capitalize'
import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { HttpStatusCode, UserStatus, UserVerifyStatus } from '~/constants/enum'
import { USER_MESSAGES } from '~/constants/message'
import { VIET_NAM_PHONE_NUMBER_REGEX } from '~/constants/regex'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
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

const confirmPasswordSchema: ParamSchema = {
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

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refreshToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const [decodedRefreshToken, refreshToken] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              if (!refreshToken) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGES.REFRESH_TOKEN_DOES_NOT_EXIST,
                  status: HttpStatusCode.Unauthorized
                })
              }
              ;(req as Request).decodedRefreshToken = decodedRefreshToken
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HttpStatusCode.Unauthorized
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const verifiedUserValidator = (req: Request, _: Response, next: NextFunction) => {
  const { verify } = req.decodedAuthorization as TokenPayload
  if (verify === UserVerifyStatus.Unverified) {
    next(
      new ErrorWithStatus({
        message: USER_MESSAGES.USER_IS_UNVERIFIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}

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
      confirmPassword: confirmPasswordSchema
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
            const user = await databaseService.users.findOne({
              email,
              password: hashPassword(value)
            })
            if (!user) {
              throw new Error(USER_MESSAGES.PASSWORD_OR_EMAIL_IS_INCORRECT)
            }
            if (user.status === UserStatus.Inactive) {
              throw new Error(USER_MESSAGES.USER_IS_INACTIVE)
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

export const resendEmailVerifyValidator = (req: Request, _: Response, next: NextFunction) => {
  const { verify } = req.decodedAuthorization as TokenPayload
  if (verify === UserVerifyStatus.Verified) {
    next(
      new ErrorWithStatus({
        message: USER_MESSAGES.VERIFIED_USER,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}

export const verifyEmailValidator = validate(
  checkSchema(
    {
      verifyEmailToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.VERIFY_EMAIL_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            const user = await databaseService.users.findOne({
              verifyEmailToken: value
            })
            if (!user) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.VERIFY_EMAIL_TOKEN_DOES_NOT_EXIST,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const decodedVerifyEmailToken = await verifyToken({
                token: value,
                secretOrPublicKey: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_SECRET
              })
              ;(req as Request).decodedVerifyEmailToken = decodedVerifyEmailToken
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
    ['body']
  )
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        ...emailSchema,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (!user) {
              throw new Error(USER_MESSAGES.EMAIL_DOES_NOT_EXIST)
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

export const forgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgotPasswordToken: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HttpStatusCode.Unauthorized
              })
            }
            try {
              const [decodedForgotPasswordToken, forgotPasswordToken] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: ENV_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_SECRET }),
                databaseService.users.findOne({ forgotPasswordToken: value })
              ])
              if (!forgotPasswordToken) {
                throw new ErrorWithStatus({
                  message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_DOES_NOT_EXIST,
                  status: HttpStatusCode.Unauthorized
                })
              }
              ;(req as Request).decodedForgotPasswordToken = decodedForgotPasswordToken
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HttpStatusCode.Unauthorized
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const changePasswordValidator = validate(
  checkSchema(
    {
      oldPassword: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.OLD_PASSWORD_IS_REQUIRED
        },
        custom: {
          options: async (value: string, { req }) => {
            const { userId } = (req as Request).decodedAuthorization as TokenPayload
            const user = await databaseService.users.findOne({
              _id: new ObjectId(userId),
              password: hashPassword(value)
            })
            if (!user) {
              throw new Error(USER_MESSAGES.OLD_PASSWORD_IS_INCORRECT)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const updateMeValidator = validate(
  checkSchema(
    {
      fullName: {
        optional: true,
        trim: true
      },
      phoneNumber: {
        optional: true,
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!VIET_NAM_PHONE_NUMBER_REGEX.test(value)) {
              throw new Error(USER_MESSAGES.PHONE_NUMBER_IS_INVALID)
            }
            const { userId } = (req as Request).decodedAuthorization as TokenPayload
            const user = await databaseService.users.findOne({ phoneNumber: value })
            if (user && user._id.toString() !== userId) {
              throw new Error(USER_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      avatar: {
        optional: true,
        trim: true,
        isMongoId: {
          errorMessage: USER_MESSAGES.AVATAR_IS_INVALID
        }
      }
    },
    ['body']
  )
)
