import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { PRODUCT_MESSAGES } from '~/constants/message'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import {
  BrandIdReqParams,
  CreateBrandReqBody,
  CreateProductCategoryReqBody,
  CreateProductReqBody,
  ProductCategoryIdReqParams
} from '~/models/requests/Product.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import productService from '~/services/product.services'

export const createCategoryController = async (
  req: Request<ParamsDictionary, any, CreateProductCategoryReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await productService.createCategory({ dto: req.body, userId })
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_CATEGORY_SUCCESS,
    data: result
  })
}

export const updateCategoryController = async (
  req: Request<ProductCategoryIdReqParams, any, CreateProductCategoryReqBody>,
  res: Response
) => {
  const result = await productService.updateCategory({ dto: req.body, categoryId: req.params.productCategoryId })
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_PRODUCT_CATEGORY_SUCCESS,
    data: result
  })
}

export const deleteCategoryController = async (req: Request<ProductCategoryIdReqParams>, res: Response) => {
  await productService.deleteCategory(req.params.productCategoryId)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_PRODUCT_CATEGORY_SUCCESS
  })
}

export const getAllCategoriesController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { productCategories, ...pagination } = await productService.getAllCategories(req.query)
  return res.json({
    message: PRODUCT_MESSAGES.GET_ALL_CATEGORIES_SUCCESS,
    data: {
      productCategories,
      pagination
    }
  })
}

export const createBrandController = async (req: Request<ParamsDictionary, any, CreateBrandReqBody>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await productService.createBrand({ dto: req.body, userId })
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_BRAND_SUCCESS,
    data: result
  })
}

export const updateBrandController = async (req: Request<BrandIdReqParams, any, CreateBrandReqBody>, res: Response) => {
  const result = await productService.updateBrand({ dto: req.body, brandId: req.params.brandId })
  return res.json({
    message: PRODUCT_MESSAGES.UPDATE_BRAND_SUCCESS,
    data: result
  })
}

export const deleteBrandController = async (req: Request<BrandIdReqParams>, res: Response) => {
  await productService.deleteBrand(req.params.brandId)
  return res.json({
    message: PRODUCT_MESSAGES.DELETE_BRAND_SUCCESS
  })
}

export const getAllBrandsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { brands, ...pagination } = await productService.getAllBrands(req.query)
  return res.json({
    message: PRODUCT_MESSAGES.GET_ALL_BRANDS_SUCCESS,
    data: {
      brands,
      pagination
    }
  })
}

export const createProductController = async (
  req: Request<ParamsDictionary, any, CreateProductReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await productService.createProduct({ dto: req.body, userId })
  return res.json({
    message: PRODUCT_MESSAGES.CREATE_PRODUCT_SUCCESS,
    data: result
  })
}
