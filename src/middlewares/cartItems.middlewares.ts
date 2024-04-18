import { checkSchema } from 'express-validator'
import { HttpStatusCode } from '~/constants/enum'
import { CART_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { validate } from '~/utils/validation'

export const addToCartValidator = validate(
  checkSchema(
    {
      quantity: {
        custom: {
          options: (value) => {
            if (value === undefined) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.QUANTITY_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!Number.isInteger(value)) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.QUANTITY_MUST_BE_AN_INT,
                status: HttpStatusCode.BadRequest
              })
            }
            if (value <= 0) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.QUANTITY_MUST_BE_GREATER_THAN_ZERO,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
