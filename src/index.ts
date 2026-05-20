import express from 'express'
import 'dotenv/config'

import authRouter from './modules/auth/auth.router'
import categoryRouter from './modules/category/category.router'
import env from './config/env'

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/category', categoryRouter)

const port = env.PORT
app.listen(port, () => {
    console.log(`Listening port ${port}...`)
})
