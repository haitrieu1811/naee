import { Request, Response } from 'express'

import { REVIEW_MESSAGES } from '~/constants/message'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { CreateReviewReqBody } from '~/models/requests/Review.requests'
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
