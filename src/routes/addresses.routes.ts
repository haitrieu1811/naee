import { Router } from 'express'

import {
  createAddressController,
  deleteAddressController,
  getAllAddresesController,
  getDistrictsController,
  getOneAddressController,
  getProvincesController,
  updateAddressController
} from '~/controllers/addresses.controllers'
import { addressIdValidator, createAddressValidator } from '~/middlewares/addresses.middlewares'
import { filterReqBodyMiddleware, paginationValidator } from '~/middlewares/common.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
import { wrapRequestHandler } from '~/utils/handler'

const addressesRouter = Router()

addressesRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createAddressValidator,
  wrapRequestHandler(createAddressController)
)

addressesRouter.put(
  '/:addressId',
  accessTokenValidator,
  verifiedUserValidator,
  addressIdValidator,
  createAddressValidator,
  filterReqBodyMiddleware<CreateAddressReqBody>([
    'districtId',
    'fullName',
    'isDefault',
    'phoneNumber',
    'provinceId',
    'specificAddress',
    'streetId',
    'type',
    'wardId'
  ]),
  wrapRequestHandler(updateAddressController)
)

addressesRouter.delete(
  '/:addressId',
  accessTokenValidator,
  verifiedUserValidator,
  addressIdValidator,
  wrapRequestHandler(deleteAddressController)
)

addressesRouter.get(
  '/all',
  accessTokenValidator,
  verifiedUserValidator,
  paginationValidator,
  wrapRequestHandler(getAllAddresesController)
)

addressesRouter.get('/provinces', wrapRequestHandler(getProvincesController))

addressesRouter.get('/provinces/:provinceId/districts', wrapRequestHandler(getDistrictsController))

addressesRouter.get(
  '/:addressId',
  accessTokenValidator,
  verifiedUserValidator,
  addressIdValidator,
  wrapRequestHandler(getOneAddressController)
)

export default addressesRouter
