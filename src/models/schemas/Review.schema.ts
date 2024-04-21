import { ObjectId } from 'mongodb'

type ReviewConstructor = {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  starPoint: 1 | 2 | 3 | 4 | 5
  content?: string
  photos?: ObjectId[]
  replies?: ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

export default class Review {
  _id?: ObjectId
  userId: ObjectId
  productId: ObjectId
  starPoint: 1 | 2 | 3 | 4 | 5
  content: string
  photos: ObjectId[]
  replies: ObjectId[]
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    productId,
    starPoint,
    content,
    photos,
    replies,
    createdAt,
    updatedAt
  }: ReviewConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.productId = productId
    this.starPoint = starPoint
    this.content = content || ''
    this.photos = photos || []
    this.replies = replies || []
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
