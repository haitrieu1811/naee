import { ObjectId } from 'mongodb'
import { AddressType } from '~/constants/enum'

type AddressConstructor = {
  _id?: ObjectId
  userId: ObjectId
  fullName: string
  phoneNumber: string
  type: AddressType
  provinceId: ObjectId
  districtId: string
  wardId: string
  streetId?: string
  isDefault?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export default class Address {
  _id?: ObjectId
  userId: ObjectId
  fullName: string
  phoneNumber: string
  type: AddressType
  provinceId: ObjectId
  districtId: string
  wardId: string
  streetId: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    userId,
    fullName,
    phoneNumber,
    type,
    provinceId,
    districtId,
    wardId,
    streetId,
    isDefault,
    createdAt,
    updatedAt
  }: AddressConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.fullName = fullName
    this.phoneNumber = phoneNumber
    this.type = type
    this.provinceId = provinceId
    this.districtId = districtId
    this.wardId = wardId
    this.streetId = streetId || ''
    this.isDefault = isDefault || false
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
