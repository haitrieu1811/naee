import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

const env = process.env.NODE_ENV
const envFilename = `.env.${env}`

if (!env) {
  console.log(`Bạn chưa cung cấp biến môi trường NODE_ENV (ví dụ: development, production)`)
  console.log(`Phát hiện NODE_ENV = ${env}`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${env}, vì thế app sẽ dùng file môi trường là ${envFilename}`)
if (!fs.existsSync(path.resolve(envFilename))) {
  console.log(`Không tìm thấy file môi trường ${envFilename}`)
  console.log(`Lưu ý: App không dùng file .env, ví dụ môi trường là development thì app sẽ dùng file .env.development`)
  console.log(`Vui lòng tạo file ${envFilename} và tham khảo nội dung ở file .env.example`)
  process.exit(1)
}

config({
  path: envFilename
})

export const isProduction = env === 'production'

export const ENV_CONFIG = {
  PORT: process.env.PORT as string,
  PASSWORD_SECRET: process.env.PASSWORD_SECRET as string,

  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_USERS_COLLECTION_NAME: process.env.DB_USERS_COLLECTION_NAME as string,
  DB_REFRESH_TOKENS_COLLECTION_NAME: process.env.DB_REFRESH_TOKENS_COLLECTION_NAME as string,
  DB_PRODUCTS_COLLECTION_NAME: process.env.DB_PRODUCTS_COLLECTION_NAME as string,
  DB_BRANDS_COLLECTION_NAME: process.env.DB_BRANDS_COLLECTION_NAME as string,
  DB_COLORS_COLLECTION_NAME: process.env.DB_COLORS_COLLECTION_NAME as string,

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  JWT_VERIFY_EMAIL_TOKEN_SECRET: process.env.JWT_VERIFY_EMAIL_TOKEN_SECRET as string,
  JWT_FORGOT_PASSWORD_TOKEN_SECRET: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET as string,
  JWT_ACCESS_TOKEN_EXPIRED_IN: process.env.JWT_ACCESS_TOKEN_EXPIRED_IN as string,
  JWT_REFRESH_TOKEN_EXPIRED_IN: process.env.JWT_REFRESH_TOKEN_EXPIRED_IN as string,
  JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN: process.env.JWT_VERIFY_EMAIL_TOKEN_EXPIRED_IN as string,
  JWT_FORGOT_PASSWORD_TOKEN_EXPIRED_IN: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRED_IN as string
} as const
