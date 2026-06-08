import cors from 'cors'
import env from './env'

let permitedIP: string[] = []

if (env.NODE_ENV !== 'production') {
    permitedIP.push('http://localhost:3000')
}

const corsOptions: cors.CorsOptions = {
    origin: permitedIP,
    credentials: true,
}

export default cors(corsOptions)
