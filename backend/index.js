import express from 'express'
import cookieParser from 'cookie-parser'
import { conectDB } from './db/db.js'
import dotenv from 'dotenv'
import authRoute from './routes/authroutes.js' 
import PropertyRoutes from './routes/propertyroutes.js'
import cors from 'cors'
import path from 'path'

dotenv.config() 
const __dirname =  path.resolve(); 
const app = express()
const PORT = process.env.PORT || 3000
app.use(cors({ 
  origin: 
    'http://localhost:5173', 
   credentials: true}))
app.use(express.json())
app.use(cookieParser())
app.get('/', (req, res) => {
  res.send('Hello world')
})
app.use('/api/auth', authRoute)
app.use('/api/properties', PropertyRoutes)
app.use(express.static(path.join(__dirname , '/frontend/build')))
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
});
 app.use( (err,req,res)=>{
   const statusCode = err.statusCode || 500 ; 
   const message =  err.message || 'Internal Server'
 }) 
 
app.listen(PORT, () => {
  conectDB()
  console.log('server is running on port ' + PORT)
})
   
