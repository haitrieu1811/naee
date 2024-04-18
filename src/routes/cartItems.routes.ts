import { Router } from 'express'

import { addToCartController, updateCartItemQuantityController } from '~/controllers/cartItems.controllers'
import {
  addToCartValidator,
  cartItemIdValidator,
  updateCartItemQuantityValidator
} from '~/middlewares/cartItems.middlewares'
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

cartItemsRouter.patch(
  '/:cartItemId/quantity',
  accessTokenValidator,
  verifiedUserValidator,
  cartItemIdValidator,
  updateCartItemQuantityValidator,
  wrapRequestHandler(updateCartItemQuantityController)
)

export default cartItemsRouter
