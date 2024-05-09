import { ObjectId } from 'mongodb'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'

import { ENV_CONFIG } from '~/constants/config'
import { ProductDiscountType, ProductStatus } from '~/constants/enum'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import {
  CreateBrandReqBody,
  CreateProductCategoryReqBody,
  CreateProductReqBody,
  UpdateProductCategoryReqBody
} from '~/models/requests/Product.requests'
import Brand from '~/models/schemas/Brand.schema'
import Product from '~/models/schemas/Product.schema'
import ProductCategory from '~/models/schemas/ProductCategory.schema'
import databaseService from '~/services/database.services'
import { paginationConfig } from '~/utils/utils'

class ProductService {
  async createCategory({ dto, userId }: { dto: CreateProductCategoryReqBody; userId: string }) {
    const { insertedId } = await databaseService.productCategories.insertOne(
      new ProductCategory({
        ...dto,
        userId: new ObjectId(userId)
      })
    )
    const insertedCategory = await databaseService.productCategories.findOne({ _id: insertedId })
    return {
      productCategory: insertedCategory
    }
  }

  async updateCategory({ dto, categoryId }: { dto: UpdateProductCategoryReqBody; categoryId: string }) {
    const dtoConfig = omitBy(dto, isUndefined)
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

  async getCategory(categoryId: string) {
    const category = await databaseService.productCategories.findOne(
      {
        _id: new ObjectId(categoryId)
      },
      {
        projection: {
          userId: 0
        }
      }
    )
    return {
      category
    }
  }

  async createBrand({ dto, userId }: { dto: CreateBrandReqBody; userId: string }) {
    const { insertedId } = await databaseService.brands.insertOne(
      new Brand({
        ...dto,
        userId: new ObjectId(userId)
      })
    )
    const insertedBrand = await databaseService.brands.findOne({ _id: insertedId })
    return {
      brand: insertedBrand
    }
  }

  async updateBrand({ dto, brandId }: { dto: CreateBrandReqBody; brandId: string }) {
    const updatedBrand = await databaseService.brands.findOneAndUpdate(
      {
        _id: new ObjectId(brandId)
      },
      {
        $set: dto,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          userId: 0
        }
      }
    )
    return {
      brand: updatedBrand
    }
  }

  async deleteBrand(brandId: string) {
    await databaseService.brands.deleteOne({ _id: new ObjectId(brandId) })
    return true
  }

  async getAllBrands(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const [brands, totalRows] = await Promise.all([
      databaseService.brands
        .find({}, { projection: { userId: 0 } })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseService.brands.countDocuments({})
    ])
    return {
      brands,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async getBrand(brandId: string) {
    const brand = await databaseService.brands.findOne(
      {
        _id: new ObjectId(brandId)
      },
      {
        projection: {
          userId: 0
        }
      }
    )
    return {
      brand
    }
  }

  async createProduct({ dto, userId }: { dto: CreateProductReqBody; userId: string }) {
    const dtoConfig = {
      ...dto,
      productCategoryId: new ObjectId(dto.productCategoryId),
      brandId: new ObjectId(dto.brandId),
      thumbnail: new ObjectId(dto.thumbnail),
      userId: new ObjectId(userId),
      photos: dto.photos?.map((photo) => new ObjectId(photo))
    }
    const { insertedId } = await databaseService.products.insertOne(new Product(dtoConfig))
    const insertedProduct = await databaseService.products.findOne({ _id: insertedId })
    return {
      product: insertedProduct
    }
  }

  async updateProduct({ dto, productId }: { dto: CreateProductReqBody; productId: string }) {
    const dtoConfig = {
      ...dto,
      productCategoryId: new ObjectId(dto.productCategoryId),
      brandId: new ObjectId(dto.brandId),
      thumbnail: new ObjectId(dto.thumbnail),
      photos: dto.photos?.map((photo) => new ObjectId(photo))
    }
    const updatedProduct = await databaseService.products.findOneAndUpdate(
      {
        _id: new ObjectId(productId)
      },
      {
        $set: dtoConfig,
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
    return {
      product: updatedProduct
    }
  }

  async deleteProduct(productId: string) {
    await databaseService.products.deleteOne({ _id: new ObjectId(productId) })
    return true
  }

  async getAllProducts(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const [products, totalRows] = await Promise.all([
      databaseService.products
        .aggregate([
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $unwind: {
              path: '$author'
            }
          },
          {
            $lookup: {
              from: 'productCategories',
              localField: 'productCategoryId',
              foreignField: '_id',
              as: 'category'
            }
          },
          {
            $unwind: {
              path: '$category'
            }
          },
          {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          },
          {
            $unwind: {
              path: '$brand'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'thumbnail',
              foreignField: '_id',
              as: 'thumbnail'
            }
          },
          {
            $unwind: {
              path: '$thumbnail'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'photos',
              foreignField: '_id',
              as: 'photos'
            }
          },
          {
            $addFields: {
              thumbnail: {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$thumbnail.name']
              },
              photos: {
                $map: {
                  input: '$photos',
                  as: 'photo',
                  in: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$$photo.name']
                  }
                }
              },
              priceAfterDiscount: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: ['$discountType', ProductDiscountType.Money]
                      },
                      then: {
                        $subtract: ['$price', '$discountValue']
                      }
                    },
                    {
                      case: {
                        $eq: ['$discountType', ProductDiscountType.Percent]
                      },
                      then: {
                        $subtract: [
                          '$price',
                          {
                            $multiply: [
                              '$price',
                              {
                                $divide: ['$discountValue', 100]
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
              author: {
                $first: '$author'
              },
              category: {
                $first: '$category'
              },
              brand: {
                $first: '$brand'
              },
              thumbnail: {
                $first: '$thumbnail'
              },
              name: {
                $first: '$name'
              },
              description: {
                $first: '$description'
              },
              photos: {
                $first: '$photos'
              },
              status: {
                $first: '$status'
              },
              originalPrice: {
                $first: '$price'
              },
              priceAfterDiscount: {
                $first: '$priceAfterDiscount'
              },
              availableCount: {
                $first: '$availableCount'
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
              'author.password': 0,
              'author.phoneNumber': 0,
              'author.avatar': 0,
              'author.verifyEmailToken': 0,
              'author.forgotPasswordToken': 0,
              'author.addresses': 0,
              'author.status': 0,
              'author.role': 0,
              'author.verify': 0,
              'category.userId': 0,
              'brand.userId': 0
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.products.countDocuments({})
    ])
    return {
      products,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }

  async getProduct(productId: string) {
    const products = await databaseService.products
      .aggregate([
        {
          $match: {
            _id: new ObjectId(productId)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'author'
          }
        },
        {
          $unwind: {
            path: '$author'
          }
        },
        {
          $lookup: {
            from: 'productCategories',
            localField: 'productCategoryId',
            foreignField: '_id',
            as: 'category'
          }
        },
        {
          $unwind: {
            path: '$category'
          }
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brandId',
            foreignField: '_id',
            as: 'brand'
          }
        },
        {
          $unwind: {
            path: '$brand'
          }
        },
        {
          $lookup: {
            from: 'files',
            localField: 'thumbnail',
            foreignField: '_id',
            as: 'thumbnail'
          }
        },
        {
          $unwind: {
            path: '$thumbnail'
          }
        },
        {
          $lookup: {
            from: 'files',
            localField: 'photos',
            foreignField: '_id',
            as: 'photos'
          }
        },
        {
          $addFields: {
            thumbnailConfig: {
              _id: '$thumbnail._id',
              url: {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$thumbnail.name']
              }
            },
            photos: {
              $map: {
                input: '$photos',
                as: 'photo',
                in: {
                  _id: '$$photo._id',
                  url: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$$photo.name']
                  }
                }
              }
            },
            priceAfterDiscount: {
              $switch: {
                branches: [
                  {
                    case: {
                      $eq: ['$discountType', ProductDiscountType.Money]
                    },
                    then: {
                      $subtract: ['$price', '$discountValue']
                    }
                  },
                  {
                    case: {
                      $eq: ['$discountType', ProductDiscountType.Percent]
                    },
                    then: {
                      $subtract: [
                        '$price',
                        {
                          $multiply: [
                            '$price',
                            {
                              $divide: ['$discountValue', 100]
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
            author: {
              $first: '$author'
            },
            category: {
              $first: '$category'
            },
            brand: {
              $first: '$brand'
            },
            thumbnail: {
              $first: '$thumbnailConfig'
            },
            name: {
              $first: '$name'
            },
            description: {
              $first: '$description'
            },
            photos: {
              $first: '$photos'
            },
            status: {
              $first: '$status'
            },
            originalPrice: {
              $first: '$price'
            },
            priceAfterDiscount: {
              $first: '$priceAfterDiscount'
            },
            availableCount: {
              $first: '$availableCount'
            },
            discountType: {
              $first: '$discountType'
            },
            discountValue: {
              $first: '$discountValue'
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
            'author.password': 0,
            'author.phoneNumber': 0,
            'author.avatar': 0,
            'author.verifyEmailToken': 0,
            'author.forgotPasswordToken': 0,
            'author.addresses': 0,
            'author.status': 0,
            'author.role': 0,
            'author.verify': 0,
            'category.userId': 0,
            'brand.userId': 0
          }
        }
      ])
      .toArray()
    return {
      product: products[0]
    }
  }

  async getProducts(query: PaginationReqQuery) {
    const { page, limit, skip } = paginationConfig(query)
    const match = { status: ProductStatus.Active }
    const [products, totalRows] = await Promise.all([
      databaseService.products
        .aggregate([
          {
            $match: match
          },
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'author'
            }
          },
          {
            $unwind: {
              path: '$author'
            }
          },
          {
            $lookup: {
              from: 'productCategories',
              localField: 'productCategoryId',
              foreignField: '_id',
              as: 'category'
            }
          },
          {
            $unwind: {
              path: '$category'
            }
          },
          {
            $lookup: {
              from: 'brands',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brand'
            }
          },
          {
            $unwind: {
              path: '$brand'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'thumbnail',
              foreignField: '_id',
              as: 'thumbnail'
            }
          },
          {
            $unwind: {
              path: '$thumbnail'
            }
          },
          {
            $lookup: {
              from: 'files',
              localField: 'photos',
              foreignField: '_id',
              as: 'photos'
            }
          },
          {
            $addFields: {
              thumbnail: {
                $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$thumbnail.name']
              },
              photos: {
                $map: {
                  input: '$photos',
                  as: 'photo',
                  in: {
                    $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$$photo.name']
                  }
                }
              },
              priceAfterDiscount: {
                $switch: {
                  branches: [
                    {
                      case: {
                        $eq: ['$discountType', ProductDiscountType.Money]
                      },
                      then: {
                        $subtract: ['$price', '$discountValue']
                      }
                    },
                    {
                      case: {
                        $eq: ['$discountType', ProductDiscountType.Percent]
                      },
                      then: {
                        $subtract: [
                          '$price',
                          {
                            $multiply: [
                              '$price',
                              {
                                $divide: ['$discountValue', 100]
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
              author: {
                $first: '$author'
              },
              category: {
                $first: '$category'
              },
              brand: {
                $first: '$brand'
              },
              thumbnail: {
                $first: '$thumbnail'
              },
              name: {
                $first: '$name'
              },
              description: {
                $first: '$description'
              },
              photos: {
                $first: '$photos'
              },
              status: {
                $first: '$status'
              },
              originalPrice: {
                $first: '$price'
              },
              priceAfterDiscount: {
                $first: '$priceAfterDiscount'
              },
              availableCount: {
                $first: '$availableCount'
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
              'author.password': 0,
              'author.phoneNumber': 0,
              'author.avatar': 0,
              'author.verifyEmailToken': 0,
              'author.forgotPasswordToken': 0,
              'author.addresses': 0,
              'author.status': 0,
              'author.role': 0,
              'author.verify': 0,
              'category.userId': 0,
              'brand.userId': 0
            }
          },
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ])
        .toArray(),
      databaseService.products.countDocuments(match)
    ])
    return {
      products,
      page,
      limit,
      totalRows,
      totalPages: Math.ceil(totalRows / limit)
    }
  }
}

const productService = new ProductService()
export default productService
