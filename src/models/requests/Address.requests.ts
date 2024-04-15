import { ParamsDictionary } from 'express-serve-static-core'
import { AddressType } from '~/constants/enum'

export type CreateAddressReqBody = {
  fullName: string
  phoneNumber: string
  type: AddressType
  provinceId: string
  districtId: string
  wardId: string
  streetId?: string
  specificAddress: string
  isDefault?: boolean
}

export type AddressIdReqParams = ParamsDictionary & {
  addressId: string
}
