import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserRole, UserStatus, UserVerifyStatus } from '~/constants/enum'

export type TokenPayload = JwtPayload & {
  tokenType: TokenType
  userId: string
  role: UserRole
  status: UserStatus
  verify: UserVerifyStatus
  iat?: number
  exp?: number
}

export type RegisterReqBody = {
  email: string
  password: string
}
