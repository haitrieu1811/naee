import { Router } from 'express'

import {
  cancelOrderController,
  deleteOrderController,
  getAllOrdersController,
  getMyOrdersController,
  updateOrderStatusController
} from '~/controllers/orders.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import {
  cancelOrderValidator,
  isAuthorOfOrderValidator,
  orderIdValidator,
  updateOrderStatusValidator
} from '~/middlewares/orders.middlewares'
import { accessTokenValidator, isAdminValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const ordersRouter = Router()

ordersRouter.get(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getMyOrdersController)
)

ordersRouter.post(
  '/:orderId/cancel',
  accessTokenValidator,
  verifiedUserValidator,
  orderIdValidator,
  isAuthorOfOrderValidator,
  cancelOrderValidator,
  wrapRequestHandler(cancelOrderController)
)

ordersRouter.get(
  '/all',
  accessTokenValidator,
  verifiedUserValidator,
  isAdminValidator,
  paginationValidator,
  wrapRequestHandler(getAllOrdersController)
)

ordersRouter.patch(
  '/:orderId/update-status',
  accessTokenValidator,
  verifiedUserValidator,
  isAdminValidator,
  orderIdValidator,
  updateOrderStatusValidator,
  wrapRequestHandler(updateOrderStatusController)
)

ordersRouter.delete(
  '/:orderId',
  accessTokenValidator,
  verifiedUserValidator,
  isAdminValidator,
  orderIdValidator,
  wrapRequestHandler(deleteOrderController)
)

export default ordersRouter
