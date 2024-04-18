import { Request, Response } from 'express'

import { CART_MESSAGES } from '~/constants/message'
import { AddToCartReqBody } from '~/models/requests/CartItem.requests'
import { ProductIdReqParams } from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import cartItemService from '~/services/cartItems.services'

export const addToCartController = async (req: Request<ProductIdReqParams, any, AddToCartReqBody>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await cartItemService.addToCart({
    productId: req.params.productId,
    quantity: req.body.quantity,
    userId
  })
  return res.json({
    message: CART_MESSAGES.ADD_TO_CART_SUCCESS,
    data: result
  })
}
