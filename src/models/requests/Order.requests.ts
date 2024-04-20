import { ParamsDictionary } from 'express-serve-static-core'
import { OrderStatus } from '~/constants/enum'

export type OrderIdReqParams = ParamsDictionary & {
  orderId: string
}

export type UpdateOrderStatusReqBody = {
  status: OrderStatus
}
