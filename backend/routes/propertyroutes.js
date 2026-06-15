import express from 'express'
 import { updateProperty  , createProperty , getProperty ,   deleteProperty} from "../controller/propertycontroller.js"
import { verifyToken } from "../middleware/verifyToken.js"
 const router =  express.Router()
router.post('/create' , createProperty)
router.get('/get:id' , getProperty)
router.put('/update:id' , verifyToken,  updateProperty )
router.delete('/delete:id' , verifyToken ,  deleteProperty)  
 export default router 

