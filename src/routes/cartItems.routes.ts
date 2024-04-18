import { Router } from 'express'

import { addToCartController } from '~/controllers/cartItems.controllers'
import { addToCartValidator } from '~/middlewares/cartItems.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const cartItemsRouter = Router()

cartItemsRouter.post(
  '/add-to-cart/products/:productId',
  accessTokenValidator,
  verifiedUserValidator,
  productIdValidator,
  addToCartValidator,
  wrapRequestHandler(addToCartController)
)

export default cartItemsRouter
