// the logic to add, update and delete a product to from cart
import { product } from "../models/product.js";

// to add an image of the product to the database
import multer from "multer";
import path from "path";

import CustomErrorHandler from "../services/CustomErrorHandler.js";
import Joi from "joi";
import fs from "fs";
import { Product } from "../models/index.js";
import productSchema from "../validators/productValidators.js"


// Specifying the image characteristics
const storage = multer.diskStorage({
    // to signify where the file will be stored
    destination: (req, file, cb) => cb(null, 'uploads/'),
    // name of the image should be unique for identification
    filename: () => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`
        cb(null, uniqueName);
    }
});


// to upload a single image of max size 5mb
const handleMultipartData = multer({storage, limits: {fileSize: 1000000*5}}).single('image');


const productController = {
    // adding a product 
    async store(req, res, next){
        // Multipart form data
        handleMultipartData(req, res, async (err) => {
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }

            const filePath = req.file.path;
            // validating the request
            const productSchema = Joi.object({
                name: Joi.string().required(),
                price: Joi.number().required(),
                password: Joi.string().required(),
            });
    
            const { error } = productSchema.validate(req.body);

            if(error){
                // if the validation fails then we have to delete the uploaded file 
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message));
                    }
                });
                    return next(error);
                    // rootfolder -> uploads -> filename
            }

            // if validation is successful
            const {name, price, size} = req.body;
            let document;
            try{
                document = await Product.create({
                    name, 
                    price,
                    size,
                    path: filePath
                });

            }
            catch(err){
                return next(err);
            }
            res.status(201).json(document);
        });
    },

    // updating the changes made in the order made by the admin 
    update(req, res, next){
        handleMultipartData(req, res, async (err) => {
            if(err){
                return next(CustomErrorHandler.serverError(err.message));
            }

            let filePath;
            if(req.file){
                filePath = req.file.path;
            }

            // validating the request
    
            const { error } = productSchema.validate(req.body);

            if(error){
                // if the validation fails then we have to delete the uploaded file 
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message));
                        }
                    });
                }
                    return next(error);
                    // rootfolder -> uploads -> filename
            }

            // if validation is successful
            const {name, price, size} = req.body;
            let document;
            try{
                document = await Product.findOneAndUpdate({_id: req.params.id}, {
                    name, 
                    price,
                    size,
                    ...(req.file && {image: filePath})
                }, {new: true});

            }
            catch(err){
                return next(err);
            }
            res.status(201).json(document);
        });
    },

    // Deleting a product
    async destroy(req, res, next){
        const document = await Product.findOneAndRemove({_id: req.params.id});
        if(!document){
            return next(new Error("Nothing to delete!"));
        }
        // deleting the image from the database
        const imagePath = document._doc.path;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if(err){
                return next(CustomErrorHandler.serverError());
            }
            res.json(document);
        });
    }
}

export default productController;