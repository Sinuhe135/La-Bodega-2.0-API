import express from 'express'
import 'dotenv/config'

import authRouter from './modules/auth/auth.router'

const app = express()

app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening port ${port}...`)
})
