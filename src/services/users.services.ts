import omit from 'lodash/omit'
import { ObjectId, WithId } from 'mongodb'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'

import { ENV_CONFIG } from '~/constants/config'
import { TokenType, UserRole, UserStatus, UserVerifyStatus } from '~/constants/enum'
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User, { LoggedUser } from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { sendForgotPasswordEmail, sendVerifyEmail } from '~/utils/email'
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

  private signVerifyEmailToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.VerifyEmail
      },
      privateKey: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_SECRET,
      options: {
        expiresIn: ENV_CONFIG.JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN
      }
    })
  }

  private signForgotPasswordToken(userId: string) {
    return signToken({
      payload: {
        userId,
        tokenType: TokenType.ForgotPassword
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
    const verifyEmailToken = await this.signVerifyEmailToken(userId.toString())
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
    const user = await databaseService.users.findOne({ _id: userId })
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
    const userConfig = omit(user, [
      'password',
      'avatar',
      'phoneNumber',
      'verifyEmailToken',
      'forgotPasswordToken',
      'addresses',
      'status',
      'role',
      'verify'
    ])
    return {
      accessToken,
      refreshToken,
      user: userConfig
    }
  }

  async aggregateUserDetail(match: any) {
    const users = await databaseService.users
      .aggregate([
        {
          $match: match
        },
        {
          $lookup: {
            from: 'files',
            localField: 'avatar',
            foreignField: '_id',
            as: 'avatar'
          }
        },
        {
          $unwind: {
            path: '$avatar',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            avatar: {
              $cond: {
                if: '$avatar',
                then: {
                  $concat: [ENV_CONFIG.HOST, '/', ENV_CONFIG.STATIC_IMAGES_PATH, '/', '$avatar.name']
                },
                else: ''
              }
            }
          }
        },
        {
          $project: {
            password: 0,
            verifyEmailToken: 0,
            forgotPasswordToken: 0,
            addresses: 0
          }
        }
      ])
      .toArray()
    return users[0]
  }

  async login(user: LoggedUser) {
    const { _id, verify, role, status } = user
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      verify,
      role,
      status
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
      refreshToken
    }
  }

  async resendEmailVerify(userId: string) {
    const [verifyEmailToken, user] = await Promise.all([
      this.signVerifyEmailToken(userId),
      databaseService.users.findOne({ _id: new ObjectId(userId) })
    ])
    await Promise.all([
      sendVerifyEmail((user as WithId<User>).email, verifyEmailToken),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(userId)
        },
        {
          $set: {
            verifyEmailToken
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return true
  }

  async verifyEmail(userId: string) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: {
          verifyEmailToken: '',
          verify: UserVerifyStatus.Verified
        },
        $currentDate: {
          updatedAt: true
        }
      }
    )
    const user = await this.aggregateUserDetail({ _id: new ObjectId(userId) })
    const { _id, role, status, verify } = user as WithId<User>
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      role,
      status,
      verify
    })
    return {
      accessToken,
      refreshToken,
      user
    }
  }

  async logout(refreshToken: string) {
    await databaseService.refreshTokens.deleteOne({ token: refreshToken })
    return true
  }

  async refreshToken({
    refreshToken,
    userId,
    verify,
    status,
    role,
    refreshTokenExp
  }: {
    refreshToken: string
    userId: string
    verify: UserVerifyStatus
    status: UserStatus
    role: UserRole
    refreshTokenExp: number
  }) {
    const [[newAccessToken, newRefreshToken]] = await Promise.all([
      this.signAccessAndRefreshToken({ userId, verify, status, role, exp: refreshTokenExp }),
      databaseService.refreshTokens.deleteOne({ token: refreshToken })
    ])
    const { iat, exp } = await this.decodeRefreshToken(newRefreshToken)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        iat,
        exp,
        token: newRefreshToken
      })
    )
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  }

  async forgotPassword({ userId, email }: { userId: string; email: string }) {
    const forgotPasswordToken = await this.signForgotPasswordToken(userId)
    await Promise.all([
      sendForgotPasswordEmail(email, forgotPasswordToken),
      databaseService.users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            forgotPasswordToken
          },
          $currentDate: {
            updatedAt: true
          }
        }
      )
    ])
    return
  }

  async resetPassword({ password, userId }: { password: string; userId: string }) {
    const user = await databaseService.users.findOneAndUpdate(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: {
          password: hashPassword(password),
          forgotPasswordToken: ''
        },
        $currentDate: {
          createdAt: true
        }
      }
    )
    const { _id, verify, status, role } = user as WithId<User>
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId: _id.toString(),
      verify,
      role,
      status
    })
    const userConfig = omit(user, [
      'password',
      'avatar',
      'phoneNumber',
      'verifyEmailToken',
      'forgotPasswordToken',
      'addresses',
      'status',
      'role',
      'verify'
    ])
    return {
      accessToken,
      refreshToken,
      user: userConfig
    }
  }

  async changePassword({ password, userId }: { password: string; userId: string }) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: {
          password: hashPassword(password)
        },
        $currentDate: {
          updatedAt: true
        }
      }
    )
    return true
  }

  async getMe(userId: string) {
    const user = await this.aggregateUserDetail({
      _id: new ObjectId(userId)
    })
    return {
      user
    }
  }

  async updateMe({ dto, userId }: { dto: UpdateMeReqBody; userId: string }) {
    const dtoConfig = omitBy(
      {
        ...dto,
        avatar: dto.avatar ? new ObjectId(dto.avatar) : undefined
      },
      isUndefined
    )
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(userId)
      },
      {
        $set: dtoConfig,
        $currentDate: {
          updatedAt: true
        }
      }
    )
    const user = await this.aggregateUserDetail({ _id: new ObjectId(userId) })
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      userId,
      role: user.role,
      status: user.status,
      verify: user.verify
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
