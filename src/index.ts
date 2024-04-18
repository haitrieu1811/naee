import express from 'express'

import { ENV_CONFIG } from '~/constants/config'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import addressesRouter from '~/routes/addresses.routes'
import filesRouter from '~/routes/files.routes'
import productsRouter from '~/routes/products.routes'
import staticRouter from '~/routes/static.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolders } from '~/utils/file'

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexAddresses()
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
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
