import { ParamsDictionary } from 'express-serve-static-core'

export type AddToCartReqBody = {
  quantity: number
}

export type CartItemIdReqParams = ParamsDictionary & {
  cartItemId: string
}

export type CartItemIdOptionalReqParams = ParamsDictionary & {
  cartItemId?: string
}

export type UpdateCartItemQuantityReqBody = {
  quantity: number
}

export type CheckoutReqBody = {
  voucherId?: string
  totalAmountReduced?: number
}
