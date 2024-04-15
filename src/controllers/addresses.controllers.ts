import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { ADDRESS_MESSAGES } from '~/constants/message'
import { CreateAddressReqBody } from '~/models/requests/Address.requests'
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
