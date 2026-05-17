import express from 'express'
import 'dotenv/config'

import authRouter from './modules/auth/auth.router'
import env from './config/env'

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)

const port = env.PORT
app.listen(port, () => {
    console.log(`Listening port ${port}...`)
})
