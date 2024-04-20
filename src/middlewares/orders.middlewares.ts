import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId, WithId } from 'mongodb'

import { HttpStatusCode, OrderStatus } from '~/constants/enum'
import { ORDER_MESSAGES, USER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { OrderIdReqParams } from '~/models/requests/Order.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import Order from '~/models/schemas/Order.schema'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const orderStatuses = numberEnumToArray(OrderStatus)

export const orderIdValidator = validate(
  checkSchema(
    {
      orderId: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.ORDER_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.ORDER_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            const order = await databaseService.orders.findOne({ _id: new ObjectId(value) })
            if (!order) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.ORDER_NOT_FOUND,
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

export const cancelOrderValidator = async (req: Request<OrderIdReqParams>, _: Response, next: NextFunction) => {
  const order = (await databaseService.orders.findOne({ _id: new ObjectId(req.params.orderId) })) as WithId<Order>
  if (order.status !== OrderStatus.WaitForConfirmation) {
    next(
      new ErrorWithStatus({
        message: ORDER_MESSAGES.CAN_NOT_CANCEL_ORDER,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}

export const updateOrderStatusValidator = validate(
  checkSchema(
    {
      status: {
        custom: {
          options: (value) => {
            if (value === undefined) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.ORDER_STATUS_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!orderStatuses.includes(value)) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.ORDER_STATUS_IS_INVALID,
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

export const isAuthorOfOrderValidator = async (req: Request<OrderIdReqParams>, _: Response, next: NextFunction) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const order = (await databaseService.orders.findOne({ _id: new ObjectId(req.params.orderId) })) as WithId<Order>
  if (order.userId.toString() !== userId) {
    next(
      new ErrorWithStatus({
        message: USER_MESSAGES.PERMISSION_DENIED,
        status: HttpStatusCode.Forbidden
      })
    )
  }
  next()
}
