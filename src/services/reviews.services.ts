import { ObjectId } from 'mongodb'

import { CreateReviewReqBody, UpdateReviewReqBody } from '~/models/requests/Review.requests'
import Review from '~/models/schemas/Review.schema'
import ReviewReply from '~/models/schemas/ReviewReply.schema'
import databaseService from '~/services/database.services'

class ReviewService {
  async create({ dto, productId, userId }: { dto: CreateReviewReqBody; productId: string; userId: string }) {
    const { insertedId } = await databaseService.reviews.insertOne(
      new Review({
        ...dto,
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
        photos: dto.photos?.map((item) => new ObjectId(item))
      })
    )
    const insertedReview = await databaseService.reviews.findOne({ _id: insertedId })
    return {
      review: insertedReview
    }
  }

  async update({ dto, reviewId }: { dto: UpdateReviewReqBody; reviewId: string }) {
    const updatedReview = await databaseService.reviews.findOneAndUpdate(
      {
        _id: new ObjectId(reviewId)
      },
      {
        $set: {
          ...dto,
          photos: dto.photos.map((item) => new ObjectId(item))
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      review: updatedReview
    }
  }

  async delete(reviewId: string) {
    await databaseService.reviews.deleteOne({ _id: new ObjectId(reviewId) })
    return true
  }

  async reply({ reviewId, content, userId }: { reviewId: string; userId: string; content: string }) {
    const { insertedId } = await databaseService.reviewReplies.insertOne(
      new ReviewReply({
        reviewId: new ObjectId(reviewId),
        userId: new ObjectId(userId),
        content
      })
    )
    const [updatedReview, insertedReviewReply] = await Promise.all([
      databaseService.reviews.findOneAndUpdate(
        {
          _id: new ObjectId(reviewId)
        },
        {
          $push: {
            replies: insertedId
          },
          $currentDate: {
            updatedAt: true
          }
        },
        {
          returnDocument: 'after'
        }
      ),
      databaseService.reviewReplies.findOne({ _id: insertedId })
    ])
    return {
      review: updatedReview,
      reviewReply: insertedReviewReply
    }
  }
}

const reviewService = new ReviewService()
export default reviewService
