import cors from 'cors'
import env from './env'

let permitedIP: string[] = []

if (env.NODE_ENV !== 'production') {
    permitedIP.push('http://localhost:3000')
}

const corsOptions: cors.CorsOptions = {
    origin: permitedIP,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}

export default cors(corsOptions)
