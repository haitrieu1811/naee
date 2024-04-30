import { ObjectId } from 'mongodb'
import { UserRole, UserStatus, UserVerifyStatus } from '~/constants/enum'

type UserConstructor = {
  _id?: ObjectId
  email: string
  password: string
  phoneNumber?: string
  fullName?: string
  avatar?: ObjectId
  verifyEmailToken?: string
  forgotPasswordToken?: string
  addresses?: ObjectId[]
  status?: UserStatus
  role?: UserRole
  verify?: UserVerifyStatus
  createdAt?: Date
  updatedAt?: Date
}

export type LoggedUser = {
  _id: ObjectId
  email: string
  fullName: string
  phoneNumber: string
  avatar: string
  status: UserStatus
  verify: UserVerifyStatus
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export default class User {
  _id?: ObjectId
  email: string
  password: string
  phoneNumber: string
  fullName: string
  avatar: ObjectId | null
  verifyEmailToken: string
  forgotPasswordToken: string
  addresses: ObjectId[]
  status: UserStatus
  role: UserRole
  verify: UserVerifyStatus
  createdAt: Date
  updatedAt: Date

  constructor({
    _id,
    email,
    password,
    phoneNumber,
    fullName,
    avatar,
    verifyEmailToken,
    forgotPasswordToken,
    addresses,
    status,
    role,
    verify,
    createdAt,
    updatedAt
  }: UserConstructor) {
    const date = new Date()
    this._id = _id
    this.email = email
    this.password = password
    this.phoneNumber = phoneNumber || ''
    this.fullName = fullName || ''
    this.avatar = avatar || null
    this.verifyEmailToken = verifyEmailToken || ''
    this.forgotPasswordToken = forgotPasswordToken || ''
    this.addresses = addresses || []
    this.status = status || UserStatus.Active
    this.role = role || UserRole.User
    this.verify = verify || UserVerifyStatus.Unverified
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
