import { ObjectId } from 'mongodb'

import CartItem from '~/models/schemas/CartItem.schema'
import databaseService from '~/services/database.services'

class CartItemService {
  async addToCart({ productId, userId, quantity }: { productId: string; userId: string; quantity: number }) {
    let cartItem = await databaseService.cartItems.findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId)
    })
    if (!cartItem) {
      const { insertedId } = await databaseService.cartItems.insertOne(
        new CartItem({
          productId: new ObjectId(productId),
          userId: new ObjectId(userId),
          quantity
        })
      )
      const insertedCartItem = await databaseService.cartItems.findOne({ _id: insertedId })
      cartItem = insertedCartItem
    } else {
      const updatedCartItem = await databaseService.cartItems.findOneAndUpdate(
        {
          userId: new ObjectId(userId),
          productId: new ObjectId(productId)
        },
        {
          $inc: {
            quantity
          }
        },
        {
          returnDocument: 'after'
        }
      )
      cartItem = updatedCartItem
    }
    return {
      cartItem
    }
  }
}

const cartItemService = new CartItemService()
export default cartItemService
