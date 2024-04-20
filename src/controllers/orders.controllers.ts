import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { ORDER_MESSAGES } from '~/constants/message'
import { TokenPayload } from '~/models/requests/User.requests'
import orderService from '~/services/orders.services'

export const getMyOrdersController = async (req: Request<ParamsDictionary>, res: Response) => {
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
