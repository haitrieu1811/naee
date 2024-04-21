import { ObjectId } from 'mongodb'

type ReviewReplyConstructor = {
  _id?: ObjectId
  userId: ObjectId
  reviewId: ObjectId
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export default class ReviewReply {
  _id?: ObjectId
  userId: ObjectId
  reviewId: ObjectId
  content: string
  createdAt: Date
  updatedAt: Date

  constructor({ _id, userId, reviewId, content, createdAt, updatedAt }: ReviewReplyConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.reviewId = reviewId
    this.content = content
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
