import { ObjectId } from 'mongodb'

import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { CreateProductCategoryReqBody } from '~/models/requests/Product.requests'
import ProductCategory from '~/models/schemas/ProductCategory.schema'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class ProductService {
  async createCategory({ dto, userId }: { dto: CreateProductCategoryReqBody; userId: string }) {
    const { insertedId } = await databaseService.productCategories.insertOne(
      new ProductCategory({
        name: dto.name,
        userId: new ObjectId(userId)
      })
    )
    const insertedCategory = await databaseService.productCategories.findOne({ _id: insertedId })
    return {
      productCategory: insertedCategory
    }
  }

  async updateCategory({ dto, categoryId }: { dto: CreateProductCategoryReqBody; categoryId: string }) {
    const category = await databaseService.productCategories.findOneAndUpdate(
      {
        _id: new ObjectId(categoryId)
      },
      {
        $set: dto,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      productCategory: category
    }
  }

  async deleteCategory(categoryId: string) {
    await databaseService.productCategories.deleteOne({ _id: new ObjectId(categoryId) })
    return true
  }

  async getAllCategories(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const [productCategories, totalRows] = await Promise.all([
      databaseService.productCategories
        .find({}, { projection: { userId: 0 } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.productCategories.countDocuments({})
    ])
    return {
      productCategories,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const productService = new ProductService()
export default productService
