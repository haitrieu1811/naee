import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode, OrderStatus } from '~/constants/enum'
import { ORDER_MESSAGES, USER_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

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
            const { userId } = (req as Request).decodedAuthorization as TokenPayload
            if (order.userId.toString() !== userId) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.PERMISSION_DENIED,
                status: HttpStatusCode.Forbidden
              })
            }
            if (order.status !== OrderStatus.WaitForConfirmation) {
              throw new ErrorWithStatus({
                message: ORDER_MESSAGES.CAN_NOT_CANCEL_ORDER,
                status: HttpStatusCode.BadRequest
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
