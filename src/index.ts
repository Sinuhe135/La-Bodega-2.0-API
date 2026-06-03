import express from 'express'
import 'dotenv/config'

import authRouter from './modules/auth/auth.router'
import categoryRouter from './modules/category/category.router'
import accountRouter from './modules/account/account.router'
import env from './config/env'

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/category', categoryRouter)
app.use('/api/account', accountRouter)

const port = env.PORT
app.listen(port, () => {
    console.log(`Listening port ${port}...`)
})
