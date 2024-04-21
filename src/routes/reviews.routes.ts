import { Router } from 'express'

import {
  createReviewController,
  deleteReviewController,
  updateReviewController
} from '~/controllers/reviews.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import {
  createReviewValidator,
  notReviewBeforeValidator,
  reviewIdValidator,
  updateReviewValidator
} from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
import { wrapRequestHandler } from '~/utils/handler'

const reviewsRouter = Router()

reviewsRouter.post(
  '/products/:productId',
  accessTokenValidator,
  verifiedUserValidator,
  productIdValidator,
  notReviewBeforeValidator,
  createReviewValidator,
  filterReqBodyMiddleware<CreateReviewReqBody>(['starPoint', 'content', 'photos']),
  wrapRequestHandler(createReviewController)
)

reviewsRouter.put(
  '/:reviewId',
  accessTokenValidator,
  verifiedUserValidator,
  reviewIdValidator,
  updateReviewValidator,
  filterReqBodyMiddleware<UpdateReviewReqBody>(['starPoint', 'content', 'photos']),
  wrapRequestHandler(updateReviewController)
)

reviewsRouter.delete(
  '/:reviewId',
  accessTokenValidator,
  verifiedUserValidator,
  reviewIdValidator,
  wrapRequestHandler(deleteReviewController)
)

export default reviewsRouter
