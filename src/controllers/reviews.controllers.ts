import { Request, Response } from 'express'

import { REVIEW_MESSAGES } from '~/constants/message'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import {
  CreateReviewReqBody,
  ReplyIdReqParams,
  ReplyReviewReqBody,
  ReviewIdReqParams,
  UpdateReviewReqBody
} from '~/models/requests/Review.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import reviewService from '~/services/reviews.services'

export const createReviewController = async (
  req: Request<ProductIdReqParams, any, CreateReviewReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await reviewService.create({ dto: req.body, productId: req.params.productId, userId })
  return res.json({
    message: REVIEW_MESSAGES.CREATE_REVIEW_SUCCESS,
    data: result
  })
}

export const updateReviewController = async (
  req: Request<ReviewIdReqParams, any, UpdateReviewReqBody>,
  res: Response
) => {
  const result = await reviewService.update({ dto: req.body, reviewId: req.params.reviewId })
  return res.json({
    message: REVIEW_MESSAGES.UPDATE_REVIEW_SUCCESS,
    data: result
  })
}

export const deleteReviewController = async (req: Request<ReviewIdReqParams>, res: Response) => {
  await reviewService.delete(req.params.reviewId)
  return res.json({
    message: REVIEW_MESSAGES.DELETE_REVIEW_SUCCESS
  })
}

export const replyReviewController = async (
  req: Request<ReviewIdReqParams, any, ReplyReviewReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await reviewService.reply({ content: req.body.content, reviewId: req.params.reviewId, userId })
  return res.json({
    message: REVIEW_MESSAGES.REPLY_REVIEW_SUCCESS,
    data: result
  })
}

export const updateReplyController = async (req: Request<ReplyIdReqParams, any, ReplyReviewReqBody>, res: Response) => {
  const result = await reviewService.updateReply({ content: req.body.content, replyId: req.params.replyId })
  return res.json({
    message: REVIEW_MESSAGES.UPDATE_REPLY_SUCCESS,
    data: result
  })
}

export const deleteReplyController = async (req: Request<ReplyIdReqParams>, res: Response) => {
  await reviewService.deleteReply(req.params.replyId)
  return res.json({
    message: REVIEW_MESSAGES.DELETE_REPLY_SUCCESS
  })
}

export const getProductReviewsController = async (
  req: Request<ProductIdReqParams, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { reviews, ...pagination } = await reviewService.getProductReviews({
    productId: req.params.productId,
    query: req.query
  })
  return res.json({
    message: REVIEW_MESSAGES.GET_PRODUCT_REVIEWS_SUCCESS,
    data: {
      reviews,
      pagination
    }
  })
}
