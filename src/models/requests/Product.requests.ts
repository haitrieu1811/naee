import { ParamsDictionary } from 'express-serve-static-core'
import { ProductDiscountType } from '~/constants/enum'

export type CreateProductCategoryReqBody = {
  name: string
}

export type ProductCategoryIdReqParams = ParamsDictionary & {
  productCategoryId: string
}

export type CreateBrandReqBody = {
  name: string
  nation: string
}

export type BrandIdReqParams = ParamsDictionary & {
  brandId: string
}

export type CreateProductReqBody = {
  productCategoryId: string
  brandId: string
  name: string
  description: string
  thumbnail: string
  photos?: string[]
  availableCount: number
  price: number
  discountType?: ProductDiscountType
  discountValue?: number
}

export type ProductIdReqParams = ParamsDictionary & {
  productId: string
}
