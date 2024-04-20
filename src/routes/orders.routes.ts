import { Router } from 'express'

import { cancelOrderController, getAllOrdersController, getMyOrdersController } from '~/controllers/orders.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import { orderIdValidator } from '~/middlewares/orders.middlewares'
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

export default ordersRouter
