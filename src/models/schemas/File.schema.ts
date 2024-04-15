import { ObjectId } from 'mongodb'
import { FileType } from '~/constants/enum'

type FileConstructor = {
  _id?: ObjectId
  userId: ObjectId
  name: string
  type: FileType
  createdAt?: Date
  updatedAt?: Date
}

export default class File {
  _id?: ObjectId
  userId: ObjectId
  name: string
  type: FileType
  createdAt: Date
  updatedAt: Date

  constructor({ _id, userId, name, type, createdAt, updatedAt }: FileConstructor) {
    const date = new Date()
    this._id = _id
    this.userId = userId
    this.name = name
    this.type = type
    this.createdAt = createdAt || date
    this.updatedAt = updatedAt || date
  }
}
