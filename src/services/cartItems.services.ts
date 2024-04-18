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
          },
          $currentDate: {
            updatedAt: true
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

  async updateCartItemQuantity({ cartItemId, quantity }: { cartItemId: string; quantity: number }) {
    const updatedCartItem = await databaseService.cartItems.findOneAndUpdate(
      { _id: new ObjectId(cartItemId) },
      {
        $set: {
          quantity
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      cartItem: updatedCartItem
    }
  }
}

const cartItemService = new CartItemService()
export default cartItemService
