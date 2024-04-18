import { ParamsDictionary } from 'express-serve-static-core'

export type AddToCartReqBody = {
  quantity: number
}

export type CartItemIdReqParams = ParamsDictionary & {
  cartItemId: string
}

export type UpdateCartItemQuantityReqBody = {
  quantity: number
}
