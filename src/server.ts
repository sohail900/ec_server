import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import './config/config'
import router from './router/router'
import { errorMiddleware } from './middleware/errorMiddleware'
const app = express()
// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ credentials: true }))
app.use(cookieParser())
app.use('/api/v1', router)
app.use(errorMiddleware)
// server
const server = http.createServer(app)
server.listen(process.env.PORT, () => {
    console.log('server listen successful')
})
