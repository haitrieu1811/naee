import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode, ProductDiscountType } from '~/constants/enum'
import { GENERAL_MESSAGES, PRODUCT_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { numberEnumToArray } from '~/utils/utils'
import { validate } from '~/utils/validation'

const productDiscountTypes = numberEnumToArray(ProductDiscountType)

const brandNameSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.BRAND_NAME_IS_REQUIRED
  }
}

const brandNationSchema: ParamSchema = {
  trim: true,
  notEmpty: {
    errorMessage: PRODUCT_MESSAGES.BRAND_NATION_IS_REQUIRED
  }
}

const categoryIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.PRODUCT_CATEGORY_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.PRODUCT_CATEGORY_ID_IS_INVALID,
          status: HttpStatusCode.BadRequest
        })
      }
      const productCategory = await databaseService.productCategories.findOne({ _id: new ObjectId(value) })
      if (!productCategory) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.PRODUCT_CATEGORY_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

const brandIdSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.BRAND_ID_IS_REQUIRED,
          status: HttpStatusCode.BadRequest
        })
      }
      if (!ObjectId.isValid(value)) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.BRAND_ID_IS_INVALID,
          status: HttpStatusCode.BadRequest
        })
      }
      const brand = await databaseService.brands.findOne({ _id: new ObjectId(value) })
      if (!brand) {
        throw new ErrorWithStatus({
          message: PRODUCT_MESSAGES.BRAND_NOT_FOUND,
          status: HttpStatusCode.NotFound
        })
      }
      return true
    }
  }
}

export const photosSchema: ParamSchema = {
  optional: true,
  custom: {
    options: (value) => {
      if (!Array.isArray(value)) {
        throw new ErrorWithStatus({
          message: GENERAL_MESSAGES.PHOTOS_MUST_BE_AN_ARRAY,
          status: HttpStatusCode.BadRequest
        })
      }
      const isValid = value.every((item) => ObjectId.isValid(item))
      if (!isValid) {
        throw new ErrorWithStatus({
          message: GENERAL_MESSAGES.PHOTOS_MUST_BE_AN_ARRAY_OBJECTID,
          status: HttpStatusCode.BadRequest
        })
      }
      return true
    }
  }
}

export const createProductCategoryValidator = validate(
  checkSchema(
    {
      name: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PRODUCT_CATEGORY_NAME_IS_REQUIRED
        }
      }
    },
    ['body']
  )
)

export const productCategoryIdValidator = validate(
  checkSchema(
    {
      productCategoryId: categoryIdSchema
    },
    ['params']
  )
)

export const brandIdValidator = validate(
  checkSchema(
    {
      brandId: brandIdSchema
    },
    ['params']
  )
)

export const createBrandValidator = validate(
  checkSchema(
    {
      name: brandNameSchema,
      nation: brandNationSchema
    },
    ['body']
  )
)

export const createProductValidator = validate(
  checkSchema(
    {
      productCategoryId: categoryIdSchema,
      brandId: brandIdSchema,
      name: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PRODUCT_NAME_IS_REQUIRED
        }
      },
      description: {
        trim: true,
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PRODUCT_DESCRIPTION_IS_REQUIRED
        }
      },
      thumbnail: {
        trim: true,
        custom: {
          options: (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.PRODUCT_THUMBNAIL_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.PRODUCT_THUMBNAIL_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            return true
          }
        }
      },
      photos: photosSchema,
      availableCount: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PRODUCT_AVAILABEL_COUNT_IS_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!Number.isInteger(value)) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_AVAILABEL_COUNT_MUST_BE_AN_INT)
            }
            if (value <= 0) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_AVAILABEL_COUNT_MUST_BE_GREATER_THAN_ZERO)
            }
            return true
          }
        }
      },
      price: {
        notEmpty: {
          errorMessage: PRODUCT_MESSAGES.PRODUCT_PRICE_IS_REQUIRED
        },
        custom: {
          options: (value) => {
            if (!Number.isInteger(value)) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_PRICE_MUST_BE_AN_INT)
            }
            if (value <= 0) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_PRICE_MUST_BE_GREATER_THAN_ZERO)
            }
            return true
          }
        }
      },
      discountType: {
        optional: true,
        isIn: {
          options: [productDiscountTypes],
          errorMessage: PRODUCT_MESSAGES.PRODUCT_DISCOUNT_TYPE_IS_INVALID
        }
      },
      discountValue: {
        optional: true,
        custom: {
          options: (value, { req }) => {
            if (!Number.isInteger(value)) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_DISCOUNT_VALUE_MUST_BE_AN_INT)
            }
            if (value < 0) {
              throw new Error(PRODUCT_MESSAGES.PRODUCT_DISCOUNT_VALUE_MUST_BE_GREATER_THAN_OR_EQUAL_ZERO)
            }
            const discountType = req.body.discountType || ProductDiscountType.Money
            const price = req.body.price
            switch (discountType) {
              case ProductDiscountType.Money:
                if (value > price) {
                  throw new Error(PRODUCT_MESSAGES.PRODUCT_DISCOUNT_VALUE_CAN_NOT_BE_GREATER_THAN_ORIGINAL_PRICE)
                }
                break
              case ProductDiscountType.Percent:
                if (value > 100) {
                  throw new Error(PRODUCT_MESSAGES.PRODUCT_DISCOUNT_VALUE_CAN_NOT_BE_GREATER_THAN_100)
                }
                break
              default:
                break
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const productIdValidator = validate(
  checkSchema(
    {
      productId: {
        trim: true,
        custom: {
          options: async (value: string) => {
            if (!value) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.PRODUCT_ID_IS_REQUIRED,
                status: HttpStatusCode.BadRequest
              })
            }
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.PRODUCT_ID_IS_INVALID,
                status: HttpStatusCode.BadRequest
              })
            }
            const product = await databaseService.products.findOne({ _id: new ObjectId(value) })
            if (!product) {
              throw new ErrorWithStatus({
                message: PRODUCT_MESSAGES.PRODUCT_NOT_FOUND,
                status: HttpStatusCode.NotFound
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)
