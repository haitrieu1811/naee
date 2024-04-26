import { Collection, Db, MongoClient } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
import Address from '~/models/schemas/Address.schema'
import Brand from '~/models/schemas/Brand.schema'
import CartItem from '~/models/schemas/CartItem.schema'
import File from '~/models/schemas/File.schema'
import Order from '~/models/schemas/Order.schema'
import Product from '~/models/schemas/Product.schema'
import ProductCategory from '~/models/schemas/ProductCategory.schema'
import { Province } from '~/models/schemas/Province.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Review from '~/models/schemas/Review.schema'
import ReviewReply from '~/models/schemas/ReviewReply.schema'
import User from '~/models/schemas/User.schema'

const uri = `mongodb+srv://${ENV_CONFIG.DB_USERNAME}:${ENV_CONFIG.DB_PASSWORD}@naee-cluster.enmafwr.mongodb.net/?retryWrites=true&w=majority&appName=naee-cluster`
class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(ENV_CONFIG.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async indexUsers() {
    const isExists = await this.users.indexExists([
      'email_1',
      'email_1_password_1',
      'verifyEmailToken_1',
      'forgotPasswordToken_1',
      '_id_password_1',
      'phoneNumber_1'
    ])
    if (isExists) return
    await Promise.all([
      this.users.createIndex({ email: 1 }, { unique: true }),
      this.users.createIndex({ email: 1, password: 1 }),
      this.users.createIndex({ verifyEmailToken: 1 }),
      this.users.createIndex({ forgotPasswordToken: 1 }),
      this.users.createIndex({ _id: 1, password: 1 }),
      this.users.createIndex({ phoneNumber: 1 })
    ])
  }

  async indexRefreshTokens() {
    const isExists = await this.refreshTokens.indexExists(['token_1'])
    if (isExists) return
    await Promise.all([this.refreshTokens.createIndex({ token: 1 }, { expireAfterSeconds: 0 })])
  }

  async indexAddresses() {
    const isExists = await this.addresses.indexExists(['userId_1'])
    if (isExists) return
    await Promise.all([this.addresses.createIndex({ userId: 1 })])
  }

  async indexCartItems() {
    const isExists = await this.cartItems.indexExists([
      'userId_1_status_1',
      'userId_1_productId_1_status_1',
      'userId_1_productId_1',
      '_id_1_userId_1',
      'userId_1'
    ])
    if (isExists) return
    await Promise.all([
      this.cartItems.createIndex({ userId: 1, status: 1 }),
      this.cartItems.createIndex({ userId: 1, productId: 1, status: 1 }),
      this.cartItems.createIndex({ userId: 1, productId: 1 }),
      this.cartItems.createIndex({ _id: 1, userId: 1 }),
      this.cartItems.createIndex({ userId: 1 })
    ])
  }

  async indexOrders() {
    const isExists = await this.orders.indexExists(['userId_1'])
    if (isExists) return
    await Promise.all([this.orders.createIndex({ userId: 1 })])
  }

  get users(): Collection<User> {
    return this.db.collection(ENV_CONFIG.DB_USERS_COLLECTION_NAME)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(ENV_CONFIG.DB_REFRESH_TOKENS_COLLECTION_NAME)
  }

  get files(): Collection<File> {
    return this.db.collection(ENV_CONFIG.DB_FILES_COLLECTION_NAME)
  }

  get addresses(): Collection<Address> {
    return this.db.collection(ENV_CONFIG.DB_ADDRESSES_COLLECTION_NAME)
  }

  get provinces(): Collection<Province> {
    return this.db.collection(ENV_CONFIG.DB_PROVINCES_COLLECTION_NAME)
  }

  get productCategories(): Collection<ProductCategory> {
    return this.db.collection(ENV_CONFIG.DB_PRODUCT_CATEGORIES_COLLECTION_NAME)
  }

  get brands(): Collection<Brand> {
    return this.db.collection(ENV_CONFIG.DB_BRANDS_COLLECTION_NAME)
  }

  get products(): Collection<Product> {
    return this.db.collection(ENV_CONFIG.DB_PRODUCTS_COLLECTION_NAME)
  }

  get cartItems(): Collection<CartItem> {
    return this.db.collection(ENV_CONFIG.DB_CART_ITEMS_COLLECTION_NAME)
  }

  get orders(): Collection<Order> {
    return this.db.collection(ENV_CONFIG.DB_ORDERS_COLLECTION_NAME)
  }

  get reviews(): Collection<Review> {
    return this.db.collection(ENV_CONFIG.DB_REVIEWS_COLLECTION_NAME)
  }

  get reviewReplies(): Collection<ReviewReply> {
    return this.db.collection(ENV_CONFIG.DB_REVIEW_REPLIES_COLLECTION_NAME)
  }
}

const databaseService = new DatabaseService()
export default databaseService
