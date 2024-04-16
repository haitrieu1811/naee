import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { ADDRESS_MESSAGES } from '~/constants/message'
import { AddressIdReqParams, CreateAddressReqBody, ProvinceIdReqParams } from '~/models/requests/Address.requests'
import { PaginationReqQuery } from '~/models/requests/Common.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import addressService from '~/services/addresses.services'

export const createAddressController = async (
  req: Request<ParamsDictionary, any, CreateAddressReqBody>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const result = await addressService.create({ dto: req.body, userId })
  return res.json({
    message: ADDRESS_MESSAGES.CREATE_ADDRESS_SUCCESS,
    data: result
  })
}

export const updateAddressController = async (
  req: Request<AddressIdReqParams, any, CreateAddressReqBody>,
  res: Response
) => {
  const result = await addressService.update({ dto: req.body, addressId: req.params.addressId })
  return res.json({
    message: ADDRESS_MESSAGES.UPDATE_ADDRESS_SUCCESS,
    data: result
  })
}

export const deleteAddressController = async (req: Request<AddressIdReqParams>, res: Response) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  await addressService.delete({ addressId: req.params.addressId, userId })
  return res.json({
    message: ADDRESS_MESSAGES.DELETE_ADDRESS_SUCCESS
  })
}

export const getAllAddresesController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { userId } = req.decodedAuthorization as TokenPayload
  const { addresses, ...pagination } = await addressService.getAll({ query: req.query, userId })
  return res.json({
    message: ADDRESS_MESSAGES.GET_ALL_ADDRESSES_SUCCESS,
    data: {
      addresses,
      pagination
    }
  })
}

export const getOneAddressController = async (req: Request<AddressIdReqParams>, res: Response) => {
  const result = await addressService.getOne(req.params.addressId)
  return res.json({
    message: ADDRESS_MESSAGES.GET_ONE_ADDRESS_SUCCESS,
    data: result
  })
}

export const getDistrictsController = async (req: Request<ProvinceIdReqParams>, res: Response) => {
  const result = await addressService.getDistrictsByProvinceId(req.params.provinceId)
  return res.json({
    message: ADDRESS_MESSAGES.GET_DISTRICTS_SUCCESS,
    data: result
  })
}
