import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { CART_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const quantitySchema: ParamSchema = {
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

export const addToCartValidator = validate(
  checkSchema(
    {
      quantity: quantitySchema
    },
    ['body']
  )
)

export const updateCartItemQuantityValidator = validate(
  checkSchema(
    {
      quantity: quantitySchema
    },
    ['body']
  )
)

export const cartItemIdValidator = validate(
  checkSchema(
    {
      cartItemId: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.CART_ITEM_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.CART_ITEM_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            const cartItem = await databaseService.cartItems.findOne({ _id: new ObjectId(value) })
            if (!cartItem) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.CART_ITEM_NOT_FOUND,
                status: HttpStatusCode.NotFound
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

export const cartItemIdOptionalValidator = validate(
  checkSchema(
    {
      cartItemId: {
        trim: true,
        optional: true,
        custom: {
          options: async (value: string) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.CART_ITEM_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            const cartItem = await databaseService.cartItems.findOne({ _id: new ObjectId(value) })
            if (!cartItem) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.CART_ITEM_NOT_FOUND,
                status: HttpStatusCode.NotFound
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
