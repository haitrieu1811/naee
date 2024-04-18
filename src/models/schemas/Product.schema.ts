import { ObjectId } from 'mongodb'

import { ProductDiscountType, ProductStatus } from '~/constants/enum'

type ProductConstructor = {
  _id?: ObjectId
  userId: ObjectId
  productCategoryId: ObjectId
  brandId: ObjectId
  name: string
  description: string
  thumbnail: ObjectId
  photos?: ObjectId[]
  status?: ProductStatus
  availableCount: number
  price: number
  discountType?: ProductDiscountType
  discountValue?: number
  createdAt?: Date
  updatedAt?: Date
}

export default class Product {
  _id?: ObjectId
  userId: ObjectId
  productCategoryId: ObjectId
  brandId: ObjectId
  name: string
  description: string
  thumbnail: ObjectId
  photos: ObjectId[]
  status: ProductStatus
  availableCount: number
  price: number
  discountType: ProductDiscountType
  discountValue: number
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    productCategoryId,
    brandId,
    name,
    description,
    thumbnail,
    photos,
    status,
    availableCount,
    price,
    discountType,
    discountValue,
    createdAt,
    updatedAt
  }: ProductConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.productCategoryId = productCategoryId
    this.brandId = brandId
    this.name = name
    this.description = description
    this.thumbnail = thumbnail
    this.photos = photos || []
    this.status = status || ProductStatus.Active
    this.availableCount = availableCount
    this.price = price
    this.discountType = discountType || ProductDiscountType.Money
    this.discountValue = discountValue || 0
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
