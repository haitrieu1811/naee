import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { ORDER_MESSAGES } from '~/constants/message'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { OrderIdReqParams } from '~/models/requests/Order.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import orderService from '~/services/orders.services'

export const getMyOrdersController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const { orders, ...pagination } = await orderService.getMyOrders({ userId, query: req.query })
  return res.json({
    message: ORDER_MESSAGES.GET_MY_ORDERS_SUCCESS,
    data: {
      orders,
      pagination
    }
  })
}

export const cancelOrderController = async (req: Request<OrderIdReqParams>, res: Response) => {
  const result = await orderService.cancelOrder(req.params.orderId)
  return res.json({
    message: ORDER_MESSAGES.CANCEL_ORDER_SUCCESS,
    data: result
  })
}

export const getAllOrdersController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { orders, ...pagination } = await orderService.getAllOrders(req.query)
  return res.json({
    message: ORDER_MESSAGES.GET_ALL_ORDERS_SUCCESS,
    data: {
      orders,
      pagination
    }
  })
}
