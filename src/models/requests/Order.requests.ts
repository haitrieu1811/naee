import { ParamsDictionary } from 'express-serve-static-core'

export type OrderIdReqParams = ParamsDictionary & {
  orderId: string
}
