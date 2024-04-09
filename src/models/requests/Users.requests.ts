import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserRole, UserStatus, UserVerifyStatus } from '~/constants/enum'

export type TokenPayload = JwtPayload & {
  tokenType: TokenType
  userId: string
  role: UserRole
  status: UserStatus
  verify: UserVerifyStatus
  iat: number
  exp: number
}

export type RegisterReqBody = {
  email: string
  password: string
}

export type LoginReqBody = {
  email: string
  password: string
}

export type LogoutReqBody = {
  refreshToken: string
}

export type RefreshTokenReqBody = {
  refreshToken: string
}

export type ForgotPasswordTokenReqBody = {
  forgotPasswordToken: string
}

export type ResetPasswordReqBody = {
  password: string
}
