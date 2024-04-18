import { ParamSchema, checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

import { HttpStatusCode } from '~/constants/enum'
import { PRODUCT_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

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
      productCategoryId: {
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
    },
    ['params']
  )
)

export const brandIdValidator = validate(
  checkSchema(
    {
      brandId: {
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
