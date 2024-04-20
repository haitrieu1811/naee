import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { CartItemStatus, HttpStatusCode } from '~/constants/enum'
import { CART_MESSAGES, VOUCHER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
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

export const checkoutValidator = validate(
  checkSchema(
    {
      voucherId: {
        optional: true,
        trim: true,
        custom: {
          options: (value: string) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: VOUCHER_MESSAGES.VOUCHER_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      totalAmountReduced: {
        optional: true,
        custom: {
          options: (value, { req }) => {
            if (value === undefined) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.TOTAL_AMOUNT_REDUCED_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!Number.isInteger(value)) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.TOTAL_AMOUNT_REDUCED_MUST_BE_AN_INT,
                status: HttpStatusCode.BadRequest
              })
            }
            if (value < 0) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.TOTAL_AMOUNT_REDUCED_MUST_BE_GREATER_THAN_OR_EQUAL_ZERO,
                status: HttpStatusCode.BadRequest
              })
            }
            const { totalAmount } = req.body
            if (value > totalAmount) {
              throw new ErrorWithStatus({
                message: CART_MESSAGES.TOTAL_AMOUNT_REDUCED_MUST_BE_LESS_THAN_TOTAL_AMOUNT,
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

export const notEmptyCartValidator = async (req: Request, _: Response, next: NextFunction) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const cartItemsCount = await databaseService.cartItems.countDocuments({
    userId: new ObjectId(userId),
    status: CartItemStatus.InCart
  })
  if (cartItemsCount <= 0) {
    next(
      new ErrorWithStatus({
        message: CART_MESSAGES.CART_IS_EMPTY,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}
