import app from './app'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Middleware to enhance security by setting various HTTP headers
app.use(helmet())

// Logging middleware
app.use(morgan('combined'))

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })) // 100 requests per 15 minutes

const IP = 'localhost' 
const PORT = 3000 
app.listen(PORT, IP, () => {
    console.log(`Server is running on internal address http://${IP}:${PORT}`)
})
