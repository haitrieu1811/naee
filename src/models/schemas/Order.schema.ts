import { ObjectId } from 'mongodb'
import { OrderStatus } from '~/constants/enum'

export class OrderItem {
  cartItemId: ObjectId
  productId: ObjectId
  unitPrice: number
  quantity: number

  constructor({
    cartItemId,
    productId,
    unitPrice,
    quantity
  }: {
    cartItemId: ObjectId
    productId: ObjectId
    unitPrice: number
    quantity: number
  }) {
    this.cartItemId = cartItemId
    this.productId = productId
    this.unitPrice = unitPrice
    this.quantity = quantity
  }
}

type OrderConstructor = {
  _id?: ObjectId
  userId: ObjectId
  voucherId?: ObjectId
  status?: OrderStatus
  items: OrderItem[]
  totalAmount: number
  totalAmountReduced?: number
  totalPayment?: number
  totalQuantity: number
  createdAt?: Date
  updatedAt?: Date
}

export default class Order {
  _id?: ObjectId
  userId: ObjectId
  voucherId: ObjectId | null
  status: OrderStatus
  items: OrderItem[]
  totalAmount: number
  totalAmountReduced: number
  totalPayment: number
  totalQuantity: number
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    voucherId,
    status,
    items,
    totalAmount,
    totalAmountReduced,
    totalPayment,
    totalQuantity,
    createdAt,
    updatedAt
  }: OrderConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.voucherId = voucherId || null
    this.status = status || OrderStatus.WaitForConfirmation
    this.items = items
    this.totalAmount = totalAmount
    this.totalAmountReduced = totalAmountReduced || 0
    this.totalPayment = totalPayment || this.totalAmount - this.totalAmountReduced
    this.totalQuantity = totalQuantity
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
