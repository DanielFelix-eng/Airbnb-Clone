import mongoose from "mongoose"
 const propertySchema  =  new mongoose.Schema({ 
   
title:String , 
 description:String , 
 location:String ,
  price :Number , 
  images :[]
}) 
    export const Property  =  mongoose.model('Property' , propertySchema)
