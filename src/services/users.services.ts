import { ObjectId, WithId } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import { TokenType, UserRole, UserStatus, UserVerifyStatus } from '~/constants/enum'
import { RegisterReqBody } from '~/models/requests/Users.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { sendVerifyEmail } from '~/utils/email'
import { signToken, verifyToken } from '~/utils/jwt'

type SignToken = {
  userId: string
  verify: UserVerifyStatus
  role: UserRole
  status: UserStatus
  iat?: number
  exp?: number
}

class UserService {
  private signAccessToken({ userId, verify, status, role }: SignToken) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.Access,
        verify,
        status,
        role
      },
      privateKey: ENV_CONFIG.JWT_ACCESS_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_ACCESS_TOKEN_EXPIRED_IN
      }
    })
  }

  private signRefreshToken({ userId, verify, status, role, exp }: SignToken) {
    if (exp) {
      return signToken({
        payload: {
          userId,
          tokenType: TokenType.Refresh,
          verify,
          status,
          role,
          exp
        },
        privateKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET
      })
    }
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.Refresh,
        status,
        verify,
        role
      },
      privateKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_REFRESH_TOKEN_EXPIRED_IN
      }
    })
  }

  private signVerifyEmailToken({ userId, verify, role, status }: SignToken) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.VerifyEmail,
        verify,
        role,
        status
      },
      privateKey: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN
      }
    })
  }

  private signForgotPasswordToken({ userId, verify, role, status }: SignToken) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.ForgotPassword,
        verify,
        role,
        status
      },
      privateKey: ENV_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_FORGOT_PASSWORD_TOKEN_EXPIRED_IN
      }
    })
  }

  private signAccessAndRefreshToken({ userId, verify, role, status, exp }: SignToken) {
    return Promise.all([
      this.signAccessToken({ userId, verify, role, status }),
      this.signRefreshToken({ userId, verify, role, status, exp })
    ])
  }

  private decodeRefreshToken(refreshToken: string) {
    return verifyToken({
      token: refreshToken,
      secretOrPublicKey: ENV_CONFIG.JWT_REFRESH_TOKEN_SECRET as string
    })
  }

  async register(data: RegisterReqBody) {
    const { email, password } = data
    const userId = new ObjectId()
    const verifyEmailToken = await this.signVerifyEmailToken({
      userId: userId.toString(),
      verify: UserVerifyStatus.Unverified,
      role: UserRole.User,
      status: UserStatus.Active
    })
    try {
      await Promise.all([
        sendVerifyEmail(email, verifyEmailToken),
        databaseService.users.insertOne(
          new User({
            _id: userId,
            email,
            password: hashPassword(password),
            verifyEmailToken
          })
        )
      ])
    } catch (error) {
      console.log(error)
    }
    const user = await databaseService.users.findOne(
      {
        _id: userId
      },
      {
        projection: {
          password: 0,
          avatar: 0,
          phoneNumber: 0,
          verifyEmailToken: 0,
          forgotPasswordToken: 0,
          addresses: 0,
          status: 0,
          role: 0,
          verify: 0
        }
      }
    )
    const { _id, verify, status, role } = user as WithId<User>
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      verify,
      status,
      role
    })
    const { iat, exp } = await this.decodeRefreshToken(refreshToken)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refreshToken,
        iat,
        exp
      })
    )
    return {
      accessToken,
      refreshToken,
      user
    }
  }
}

const userService = new UserService()
export default userService
