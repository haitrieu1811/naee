import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { ADDRESS_MESSAGES } from '~/constants/message'
import { AddressIdReqParams, CreateAddressReqBody } from '~/models/requests/Address.requests'
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
  await addressService.delete(req.params.addressId)
  return res.json({
    message: ADDRESS_MESSAGES.DELETE_ADDRESS_SUCCESS
  })
}
