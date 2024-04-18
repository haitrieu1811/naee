import { ObjectId } from 'mongodb'
import { CartItemStatus } from '~/constants/enum'

type CartItemConstructor = {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  quantity: number
  status?: CartItemStatus
  createdAt?: Date
  updatedAt?: Date
}

export default class CartItem {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  quantity: number
  status: CartItemStatus
  createdAt: Date
  updatedAt: Date

  constructor({ _id, productId, userId, quantity, status, createdAt, updatedAt }: CartItemConstructor) {
    const date = new Date()
    this._id = _id
    this.productId = productId
    this.userId = userId
    this.quantity = quantity
    this.status = status || CartItemStatus.InCart
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
