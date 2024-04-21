import { Router } from 'express'

import { createReviewController } from '~/controllers/reviews.controllers'
import { productIdValidator } from '~/middlewares/products.middlewares'
import { createReviewValidator, notReviewBeforeValidator } from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const reviewsRouter = Router()

reviewsRouter.post(
  '/products/:productId',
  accessTokenValidator,
  verifiedUserValidator,
  productIdValidator,
  notReviewBeforeValidator,
  createReviewValidator,
  wrapRequestHandler(createReviewController)
)

export default reviewsRouter
