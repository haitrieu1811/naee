import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { REVIEW_MESSAGES, USER_MESSAGES } from '~/constants/message'
import { photosSchema } from '~/middlewares/products.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

const starPointSchema: ParamSchema = {
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
}

export const createReviewValidator = validate(
  checkSchema(
    {
      starPoint: starPointSchema,
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

export const reviewIdValidator = validate(
  checkSchema(
    {
      reviewId: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: REVIEW_MESSAGES.REVIEW_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: REVIEW_MESSAGES.REVIEW_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            const review = await databaseService.reviews.findOne({ _id: new ObjectId(value) })
            if (!review) {
              throw new ErrorWithStatus({
                message: REVIEW_MESSAGES.REVIEW_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            const { userId } = (req as Request).decodedAuthorization as TokenPayload
            if (userId !== review.userId.toString()) {
              throw new ErrorWithStatus({
                message: USER_MESSAGES.PERMISSION_DENIED,
                status: HttpStatusCode.Forbidden
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)

export const updateReviewValidator = validate(
  checkSchema(
    {
      starPoint: starPointSchema,
      content: {
        trim: true,
        notEmpty: {
          errorMessage: REVIEW_MESSAGES.CONTENT_IS_REQUIRED
        }
      },
      photos: {
        ...photosSchema,
        optional: false
      }
    },
    ['body']
  )
)
