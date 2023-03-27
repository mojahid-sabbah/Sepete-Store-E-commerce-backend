import { categoryModel } from "../../../../DB/models/category.model.js";
import { subcategoryModel } from "../../../../DB/models/subCategory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from 'slugify';
import { pagination } from '../../../services/pagination.js'

export const createsubCategory = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: 'image is required ' })
        }
        const { categoryId } = req.params;
        const category = await categoryModel.findById(categoryId)

        if (!category) {
            res.status(400).json({ message: 'not found category' })
        } else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Ecommerce/sub_category/catId_${categoryId}` })
            const { name } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'name is required' })
            }
            const slug = slugify(name)

            const subcategory = await subcategoryModel.create({ image: secure_url, subcategoryName: name, ImagePublicId: public_id, slug, createdBy: req.user._id, categoryId: categoryId })
            if (!subcategory) {
                res.status(400).json({ message: 'not found category' })
            } else {
                res.status(201).json({ message: 'created succefully', subcategory })
            }
        }
    } catch (error) {
        res.status(401).json({ message: 'catch created subcategory ', error })

    }
}


export const updatesubCategory = async (req, res) => {
    try {
        const { id, categoryId } = req.params;
        const category = await categoryModel.findById(categoryId)
        const subcategoryid = await subcategoryModel.findById(id)
        if (!category || !subcategoryid) {
            res.status(400).json({ message: 'not found category' })
        }
        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Ecommerce/sub_category/catId_${categoryId}` })
            req.body.image = secure_url;
            req.body.ImagePublicId = public_id;
        }

        if (req.body.name) {
            req.body.subcategoryName = req.body.name;
            req.body.slug = slugify(req.body.name)
        }

        const subcategory = await subcategoryModel.findOneAndUpdate({ _id: id, categoryId }, req.body, { new: false })
        if (req.file) {
            await cloudinary.uploader.destroy(subcategory.ImagePublicId)
        }
        if (!subcategory) {
            res.status(400).json({ message: 'fail to update category' })
        } else {
            res.status(201).json({ message: 'updated succefully', subcategory })
        }

    } catch (error) {
        res.status(401).json({ message: 'catch update subcategory ', error })

    }

}
export const getAllsubCat = async (req, res) => {
    try {
        const { page, size } = req.query; // for pagination 
        const { skip, limit } = pagination(page, size)
        const subcategory = await subcategoryModel.find({})
            .limit(limit).skip(skip).select('categoryName image')
            .populate({
                 path: 'createdBy',
                  select: 'userName' 
                })
        if (!subcategory) {
            res.status(400).json({ message: 'fail to get subcategory' })
        } else {
            res.status(201).json({ message: ' success', subcategory })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch get subcategory ', error })
    }
}

export const getsubCategory = async (req, res) => {
    try {

        const { id } = req.params
        const subcategory = await subcategoryModel.findOne({ _id: id })

        if (!subcategory) {
            res.status(400).json({ message: 'fail to get subcategory' })
        } else {
            res.status(201).json({ message: ' success', subcategory })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch get subcategory ', error })

    }
}