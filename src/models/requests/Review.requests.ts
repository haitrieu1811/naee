import { ParamsDictionary } from 'express-serve-static-core'

export type CreateReviewReqBody = {
  starPoint: 1 | 2 | 3 | 4 | 5
  content?: string
  photos?: string[]
}

export type UpdateReviewReqBody = {
  starPoint: 1 | 2 | 3 | 4 | 5
  content: string
  photos: string[]
}

export type ReviewIdReqParams = ParamsDictionary & {
  reviewId: string
}

export type ReplyReviewReqBody = {
  content: string
}
