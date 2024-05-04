import { ObjectId } from 'mongodb'

type ProductCategoryConstructor = {
  _id?: ObjectId
  userId: ObjectId
  name: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class ProductCategory {
  _id?: ObjectId
  userId: ObjectId
  name: string
  description: string
  createdAt: Date
  updatedAt: Date

  constructor({ _id, userId, name, description, createdAt, updatedAt }: ProductCategoryConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.name = name
    this.description = description || ''
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
