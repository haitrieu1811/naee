import { Router } from 'express'

import { getMyOrdersController } from '~/controllers/orders.controllers'
import { paginationValidator } from '~/middlewares/common.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const ordersRouter = Router()

ordersRouter.get(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getMyOrdersController)
)

export default ordersRouter
