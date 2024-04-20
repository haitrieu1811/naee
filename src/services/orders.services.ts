import { ObjectId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { OrderStatus } from '~/constants/enum'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class OrderService {
  private aggregateOrders({ match, skip = 0, limit = 20 }: { match: any; limit?: number; skip?: number }) {
    return databaseService.orders
      .aggregate([
        {
          $match: match
        },
        {
          $lookup: {
            from: 'products',
            localField: 'items.productId',
            foreignField: '_id',
            as: 'items'
          }
        },
        {
          $lookup: {
            from: 'productCategories',
            localField: 'items.productCategoryId',
            foreignField: '_id',
            as: 'itemCategory'
          }
        },
        {
          $unwind: {
            path: '$itemCategory'
          }
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'items.brandId',
            foreignField: '_id',
            as: 'itemBrand'
          }
        },
        {
          $unwind: {
            path: '$itemBrand'
          }
        },
        {
          $lookup: {
            from: 'files',
            localField: 'items.thumbnail',
            foreignField: '_id',
            as: 'itemThumbnail'
          }
        },
        {
          $unwind: {
            path: '$itemThumbnail'
          }
        },
        {
          $addFields: {
            'items.category': '$itemCategory',
            'items.brand': '$itemBrand',
            'items.thumbnail': {
              $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$itemThumbnail.name']
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            status: {
              $first: '$status'
            },
            items: {
              $first: '$items'
            },
            totalAmount: {
              $first: '$totalAmount'
            },
            totalAmountReduced: {
              $first: '$totalAmountReduced'
            },
            totalPayment: {
              $first: '$totalPayment'
            },
            totalQuantity: {
              $first: '$totalQuantity'
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
            'items.userId': 0,
            'items.productCategoryId': 0,
            'items.brandId': 0,
            'items.description': 0,
            'items.photos': 0,
            'items.availableCount': 0,
            'items.discountType': 0,
            'items.discountValue': 0,
            'items.createdAt': 0,
            'items.updatedAt': 0,
            'items.category.userId': 0,
            'items.brand.userId': 0
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

  async getMyOrders({ userId, query }: { userId: string; query: PaginationReqQuery }) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { userId: new ObjectId(userId) }
    const [orders, totalRows] = await Promise.all([
      this.aggregateOrders({ match, skip, limit }),
      databaseService.orders.countDocuments(match)
    ])
    return {
      orders,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async cancelOrder(orderId: string) {
    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      {
        _id: new ObjectId(orderId)
      },
      {
        $set: {
          status: OrderStatus.Cancelled
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
      order: updatedOrder
    }
  }

  async getAllOrders(query: PaginationReqQuery) {
    const { page, skip, limit } = paginationConfig(query)
    const [orders, totalRows] = await Promise.all([
      this.aggregateOrders({ match: {}, skip, limit }),
      databaseService.orders.countDocuments({})
    ])
    return {
      orders,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async updateOrderStatus({ status, orderId }: { status: OrderStatus; orderId: string }) {
    const updatedOrder = await databaseService.orders.findOneAndUpdate(
      {
        _id: new ObjectId(orderId)
      },
      {
        $set: {
          status
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
      order: updatedOrder
    }
  }
}

const orderService = new OrderService()
export default orderService
