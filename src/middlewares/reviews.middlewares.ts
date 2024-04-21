import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { REVIEW_MESSAGES } from '~/constants/message'
import { photosSchema } from '~/middlewares/products.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const createReviewValidator = validate(
  checkSchema(
    {
      starPoint: {
        custom: {
          options: (value) => {
            if (value === undefined) {
              throw new ErrorWithStatus({
                message: REVIEW_MESSAGES.STAR_POINT_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (![1, 2, 3, 4, 5].includes(value)) {
              throw new ErrorWithStatus({
                message: REVIEW_MESSAGES.STAR_POINT_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      content: {
        optional: true,
        trim: true
      },
      photos: photosSchema
    },
    ['body']
  )
)

export const notReviewBeforeValidator = async (req: Request<ProductIdReqParams>, _: Response, next: NextFunction) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const review = await databaseService.reviews.findOne({
    userId: new ObjectId(userId),
    productId: new ObjectId(req.params.productId)
  })
  if (review) {
    next(
      new ErrorWithStatus({
        message: REVIEW_MESSAGES.REVIEWED_BEFORE,
        status: HttpStatusCode.BadRequest
      })
    )
  }
  next()
}
