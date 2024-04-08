import { checkSchema } from 'express-validator'

import { USER_MESSAGES } from '~/constants/message'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        trim: true,
        notEmpty: {
          errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
        },
        custom: {
          options: async (value: string) => {
            const email = await databaseService.users.findOne({ email: value })
            if (email) {
              throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
