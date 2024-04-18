import { Router } from 'express'

import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController
} from '~/controllers/products.controllers'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { createProductCategoryValidator, productCategoryIdValidator } from '~/middlewares/products.middlewares'
import { accessTokenValidator, isAdminValidator } from '~/middlewares/users.middlewares'
import { CreateProductCategoryReqBody } from '~/models/requests/Product.requests'
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
  filterReqBodyMiddleware<CreateProductCategoryReqBody>(['name']),
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

export default productsRouter
