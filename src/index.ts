import express from 'express'

import { ENV_CONFIG } from '~/constants/config'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import addressesRouter from '~/routes/addresses.routes'
import cartItemsRouter from '~/routes/cartItems.routes'
import filesRouter from '~/routes/files.routes'
import ordersRouter from '~/routes/orders.routes'
import productsRouter from '~/routes/products.routes'
import reviewsRouter from '~/routes/reviews.routes'
import staticRouter from '~/routes/static.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolders } from '~/utils/file'

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexAddresses()
  databaseService.indexCartItems()
  databaseService.indexOrders()
})

initFolders()

const app = express()
const port = ENV_CONFIG.PORT || 4000

app.use(express.json())
app.use('/users', usersRouter)
app.use('/files', filesRouter)
app.use('/addresses', addressesRouter)
app.use('/products', productsRouter)
app.use('/static', staticRouter)
app.use('/carts', cartItemsRouter)
app.use('/orders', ordersRouter)
app.use('/reviews', reviewsRouter)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
