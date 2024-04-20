import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { CartItemStatus, ProductDiscountType } from '~/constants/enum'
import { CART_MESSAGES } from '~/constants/message'
import { CheckoutReqBody } from '~/models/requests/CartItem.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import CartItem from '~/models/schemas/CartItem.schema'
import Order, { OrderItem } from '~/models/schemas/Order.schema'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class CartItemService {
  async addToCart({ productId, userId, quantity }: { productId: string; userId: string; quantity: number }) {
    let cartItem = await databaseService.cartItems.findOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
      status: CartItemStatus.InCart
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

  async deleteCartItems({ cartItemId, userId }: { cartItemId?: string; userId: string }) {
    let message: string = CART_MESSAGES.DELETE_CART_ITEM_SUCCESS
    if (cartItemId) {
      await databaseService.cartItems.deleteOne({
        _id: new ObjectId(cartItemId),
        userId: new ObjectId(userId)
      })
    } else {
      await databaseService.cartItems.deleteMany({
        userId: new ObjectId(userId)
      })
      message = CART_MESSAGES.DELETE_ALL_CART_SUCCESS
    }
    return {
      message
    }
  }

  private aggregateCartItems({ match, skip, limit }: { match: any; skip?: number; limit?: number }) {
    return databaseService.cartItems
      .aggregate<{
        _id: string
        product: {
          _id: string
          name: string
          thumbnail: string
          availableCount: number
          price: number
          priceAfterDiscount: number
        }
        quantity: number
        createdAt: string
        updatedAt: string
      }>([
        {
          $match: match
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: '_id',
            as: 'product'
          }
        },
        {
          $unwind: {
            path: '$product'
          }
        },
        {
          $lookup: {
            from: 'files',
            localField: 'product.thumbnail',
            foreignField: '_id',
            as: 'product.thumbnail'
          }
        },
        {
          $unwind: {
            path: '$product.thumbnail'
          }
        },
        {
          $addFields: {
            'product.thumbnail': {
              $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$product.thumbnail.name']
            },
            'product.priceAfterDiscount': {
              $switch: {
                branches: [
                  {
                    case: {
                      $eq: ['$product.discountType', ProductDiscountType.Money]
                    },
                    then: {
                      $subtract: ['$product.price', '$product.discountValue']
                    }
                  },
                  {
                    case: {
                      $eq: ['$product.discountType', ProductDiscountType.Percent]
                    },
                    then: {
                      $subtract: [
                        '$product.price',
                        {
                          $multiply: [
                            '$product.price',
                            {
                              $divide: ['$product.discountValue', 100]
                            }
                          ]
                        }
                      ]
                    }
                  }
                ],
                default: 'Did not match'
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            product: {
              $first: '$product'
            },
            quantity: {
              $first: '$quantity'
            },
            createdAt: {
              $first: '$createdAt'
            },
            updatedAt: {
              $first: '$updatedAt'
            }
          }
        },
        {
          $project: {
            'product.userId': 0,
            'product.productCategoryId': 0,
            'product.brandId': 0,
            'product.description': 0,
            'product.discountType': 0,
            'product.status': 0,
            'product.discountValue': 0,
            'product.createdAt': 0,
            'product.photos': 0,
            'product.updatedAt': 0
          }
        },
        {
          $sort: {
            updatedAt: -1
          }
        },
        {
          $skip: skip
        },
        {
          $limit: limit
        }
      ])
      .toArray()
  }

  async getCartItems({ userId, query }: { userId: string; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = {
      userId: new ObjectId(userId),
      status: CartItemStatus.InCart
    }
    const [cartItems, totalRows] = await Promise.all([
      this.aggregateCartItems({ match, skip, limit }),
      databaseService.cartItems.countDocuments(match)
    ])
    return {
      cartItems,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async checkout({ dto, userId }: { dto: CheckoutReqBody; userId: string }) {
    const { totalAmountReduced, voucherId } = dto
    const totalRows = await databaseService.cartItems.countDocuments({
      userId: new ObjectId(userId),
      status: CartItemStatus.InCart
    })
    const cartItems = await this.aggregateCartItems({
      match: { userId: new ObjectId(userId) },
      skip: 0,
      limit: totalRows
    })
    const totalAmount = cartItems.reduce((acc, cur) => acc + cur.quantity * cur.product.priceAfterDiscount, 0)
    const totalQuantity = cartItems.reduce((acc, cartItem) => acc + cartItem.quantity, 0)
    const orderItems = cartItems.map(
      (cartItem) =>
        new OrderItem({
          cartItemId: new ObjectId(cartItem._id),
          productId: new ObjectId(cartItem.product._id),
          quantity: cartItem.quantity,
          unitPrice: cartItem.product.priceAfterDiscount
        })
    )
    const { insertedId } = await databaseService.orders.insertOne(
      new Order({
        items: orderItems,
        totalAmount,
        totalAmountReduced,
        voucherId: voucherId ? new ObjectId(voucherId) : undefined,
        totalQuantity,
        userId: new ObjectId(userId)
      })
    )
    const [insertedOrder] = await Promise.all([
      databaseService.orders.findOne({ _id: insertedId }),
      databaseService.cartItems.updateMany(
        {
          _id: {
            $in: orderItems.map((orderItem) => orderItem.cartItemId)
          }
        },
        {
          $set: {
            status: CartItemStatus.NotInCart
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return {
      order: insertedOrder
    }
  }
}

const cartItemService = new CartItemService()
export default cartItemService
