import { Property } from "../models/property.js" 
import { errorHandler } from "../utils/error.js"
export const createProperty = async (req,res,next) =>{ 
     
     
    try {
        const property = await Property.create(req.body) 
        return  res.status(201).json(property)
    } catch (error) {
       next(error) 
    }
}
export const deleteProperty  = async (req, res, next) => {
  try {
    const  property  = await Property.findById(req.params.id);
    if (!property) {
      return next(errorHandler(404, 'Listing not found'));
    }
    if (req.user.id !== property.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings'));
    }
    await Property.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Listing has been deleted' });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(errorHandler(404, 'Listing not found'));
    }
    return res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return next(errorHandler(404, 'Listing not found'));
    }
    if (req.user.id !== property.userRef) {
      return next(errorHandler(401, 'You can only update your own listings'));
    }
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};