import { Collection, Db, MongoClient } from 'mongodb'

import { ENV_CONFIG } from '~/constants/config'
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

  get users(): Collection<User> {
    return this.db.collection(ENV_CONFIG.DB_USERS_COLLECTION_NAME)
  }
}

const databaseService = new DatabaseService()
export default databaseService
