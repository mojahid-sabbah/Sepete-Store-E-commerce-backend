import { categoryModel } from "../../../../DB/models/category.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from 'slugify';
import { pagination } from '../../../services/pagination.js'

export const createCategory = async (req, res) => {
    try {

        if (!req.file) {
            res.status(400).json({ message: 'image is required' })
        } else {
            const { name } = req.body;
            const slug = slugify(name, '_')
            const username = await categoryModel.findOne({ categoryName: name })
            if (username) {
                return res.status(400).json({ message: 'this categories is exist' })
            }
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'Ecommerce/category' })
            const category = await categoryModel.create({ image: secure_url, categoryName: name, ImagePublicId: public_id, slug, createdBy: req.user._id })
            if (!category) {
                res.status(400).json({ message: 'fail to add category' })
            } else {
                res.status(201).json({ message: 'created succefully', category })

            }
        }
    } catch (error) {
        res.status(401).json({ message: 'catch created category ', error })

    }
}


export const updateCategory = async (req, res) => {
    try {

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'Ecommerce/category' })
            req.body.image = secure_url;
            req.body.ImagePublicId = public_id;
        }
        const { id } = req.params;

        if (req.body.name) {
            req.body.categoryName = req.body.name;
            req.body.slug = slugify(req.body.name)
        }

        const category = await categoryModel.findByIdAndUpdate(id, req.body, { new: false })
        if (req.file) {
            await cloudinary.uploader.destroy(category.ImagePublicId)
        }
        if (!category) {
            res.status(400).json({ message: 'fail to update category' })
        } else {
            res.status(201).json({ message: 'updated succefully', category })
        }

    } catch (error) {
        res.status(401).json({ message: 'catch created category ', error })

    }

}
export const getAllCat = async (req, res) => {
    try {
        const { page, size } = req.query; // for pagination 
        const { skip, limit } = pagination(page, size)
        const category = await categoryModel.find({})
            .limit(limit).skip(skip).select('categoryName image').populate(
                [
                    {
                        path: 'createdBy',
                        select: 'userName image'  
                    },
                    {
                        path: 'Virtual_subCategory', // the name of virtual that i made in model
                        select: 'subcategoryName image'  
 
                    }
                ]
            )
          
          
          
            // .populate({
            //      path: 'createdBy',
            //       select: 'userName'
            //      })
                 
        if (!category) {
            res.status(400).json({ message: 'fail to get category' })
        } else {
            res.status(201).json({ message: ' success', category })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch get category ', error })
    }
}

export const getCategory = async (req, res) => {
    try {

        const { id } = req.params
        const category = await categoryModel.findOne({ _id: id })

        if (!category) {
            res.status(400).json({ message: 'fail to get category' })
        } else {
            res.status(201).json({ message: ' success', category })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch get category ', error })

    }
}