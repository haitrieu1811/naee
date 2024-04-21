import { ObjectId } from 'mongodb'

import { CreateReviewReqBody } from '~/models/requests/Review.requests'
import Review from '~/models/schemas/Review.schema'
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
}

const reviewService = new ReviewService()
export default reviewService
