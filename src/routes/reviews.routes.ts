import { Router } from 'express'

import {
  createReviewController,
  deleteReviewController,
  replyReviewController,
  updateReviewController
} from '~/controllers/reviews.controllers'
import { filterReqBodyMiddleware } from '~/middlewares/common.middlewares'
import { productIdValidator } from '~/middlewares/products.middlewares'
import {
  authorOfReviewValidator,
  createReviewValidator,
  notReviewBeforeValidator,
  replyReviewValidator,
  reviewIdValidator,
  updateReviewValidator
} from '~/middlewares/reviews.middlewares'
import { accessTokenValidator, isAdminValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
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
  authorOfReviewValidator,
  updateReviewValidator,
  filterReqBodyMiddleware<UpdateReviewReqBody>(['starPoint', 'content', 'photos']),
  wrapRequestHandler(updateReviewController)
)

reviewsRouter.delete(
  '/:reviewId',
  accessTokenValidator,
  verifiedUserValidator,
  reviewIdValidator,
  authorOfReviewValidator,
  wrapRequestHandler(deleteReviewController)
)

reviewsRouter.post(
  '/:reviewId/reply',
  accessTokenValidator,
  verifiedUserValidator,
  isAdminValidator,
  reviewIdValidator,
  replyReviewValidator,
  wrapRequestHandler(replyReviewController)
)

export default reviewsRouter
