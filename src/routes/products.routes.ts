import { Router } from 'express'

import {
  createBrandController,
  createCategoryController,
  createProductController,
  deleteBrandController,
  deleteCategoryController,
  deleteProductController,
  getAllBrandsController,
  getAllCategoriesController,
  getBrandController,
  getCategoryController,
  getProductController,
  getProductsController,
  updateBrandController,
  updateCategoryController,
  updateProductController
} from '~/controllers/products.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import {
  brandIdValidator,
  createBrandValidator,
  createProductCategoryValidator,
  createProductValidator,
  productCategoryIdValidator,
  productIdValidator
} from '~/middlewares/products.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import {
  CreateBrandReqBody,
  CreateProductCategoryReqBody,
  CreateProductReqBody
} from '~/models/requests/Product.requests'
import { wrapRequestHandler } from '~/utils/handler'

const productsRouter = Router()

productsRouter.post(
  '/categories',
  accessTokenValidator,
  isAdminValidator,
  createProductCategoryValidator,
  wrapRequestHandler(createCategoryController)
)

productsRouter.patch(
  '/categories/:productCategoryId',
  accessTokenValidator,
  isAdminValidator,
  productCategoryIdValidator,
  createProductCategoryValidator,
  filterReqBodyMiddleware<CreateProductCategoryReqBody>(['name', 'description']),
  wrapRequestHandler(updateCategoryController)
)

productsRouter.delete(
  '/categories/:productCategoryId',
  accessTokenValidator,
  isAdminValidator,
  productCategoryIdValidator,
  wrapRequestHandler(deleteCategoryController)
)

productsRouter.get('/categories/all', paginationValidator, wrapRequestHandler(getAllCategoriesController))

productsRouter.get(
  '/categories/:productCategoryId',
  productCategoryIdValidator,
  wrapRequestHandler(getCategoryController)
)

productsRouter.post(
  '/brands',
  accessTokenValidator,
  isAdminValidator,
  createBrandValidator,
  wrapRequestHandler(createBrandController)
)

productsRouter.put(
  '/brands/:brandId',
  accessTokenValidator,
  isAdminValidator,
  brandIdValidator,
  createBrandValidator,
  filterReqBodyMiddleware<CreateBrandReqBody>(['name', 'nation', 'description']),
  wrapRequestHandler(updateBrandController)
)

productsRouter.delete(
  '/brands/:brandId',
  accessTokenValidator,
  isAdminValidator,
  brandIdValidator,
  wrapRequestHandler(deleteBrandController)
)

productsRouter.get('/brands/all', paginationValidator, wrapRequestHandler(getAllBrandsController))

productsRouter.get('/brands/:brandId', brandIdValidator, wrapRequestHandler(getBrandController))

productsRouter.post(
  '/',
  accessTokenValidator,
  isAdminValidator,
  createProductValidator,
  filterReqBodyMiddleware<CreateProductReqBody>([
    'availableCount',
    'brandId',
    'description',
    'discountType',
    'discountValue',
    'name',
    'photos',
    'price',
    'productCategoryId',
    'thumbnail',
    'status'
  ]),
  wrapRequestHandler(createProductController)
)

productsRouter.put(
  '/:productId',
  accessTokenValidator,
  isAdminValidator,
  productIdValidator,
  createProductValidator,
  filterReqBodyMiddleware<CreateProductReqBody>([
    'availableCount',
    'brandId',
    'description',
    'discountType',
    'discountValue',
    'name',
    'photos',
    'price',
    'productCategoryId',
    'thumbnail',
    'status'
  ]),
  wrapRequestHandler(updateProductController)
)

productsRouter.delete(
  '/:productId',
  accessTokenValidator,
  isAdminValidator,
  productIdValidator,
  wrapRequestHandler(deleteProductController)
)

productsRouter.get('/', paginationValidator, wrapRequestHandler(getProductsController))

productsRouter.get('/:productId', productIdValidator, wrapRequestHandler(getProductController))

export default productsRouter
