import express from 'express'
import cookieParser from 'cookie-parser'
import { conectDB } from './db/db.js'
import dotenv from 'dotenv'
import authRoute from './routes/authroutes.js' 
 import PropertyRoutes from './routes/propertyroutes.js'
import cors from 'cors'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors({origin:'http://localhost:5174/api/auth' ,credentials :true}))
app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
  res.send('Hello world')
})
app.use('/api/auth', authRoute)
app.use('/api/auth', PropertyRoutes)
app.listen(PORT, () => {
  conectDB()
  console.log('server is running on port ' + PORT)
})

   
