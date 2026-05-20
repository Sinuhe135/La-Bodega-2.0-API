import express from 'express'
import 'dotenv/config'

import authRouter from './modules/auth/auth.router'
import groupsRouter from './modules/groups/groups.router'
import env from './config/env'

const app = express()
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/groups', groupsRouter)

const port = env.PORT
app.listen(port, () => {
    console.log(`Listening port ${port}...`)
})
