import { categoryModel } from "../../../../DB/models/category.model.js";
import { brandModel } from "../../../../DB/models/brand.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from 'slugify';
import { pagination } from '../../../services/pagination.js'

export const createBrand = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ message: 'image is required ' })
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'name is required ' })
        }
        const isExist = await brandModel.findOne({ brandName: name })
        if (isExist) {
            return res.status(400).json({ message: 'Name is exist choose another one ' })
        }
        const slug = slugify(name)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Ecommerce/brand` })

        const brand = await brandModel.create({ image: secure_url, brandName: name, ImagePublicId: public_id, slug, createdBy: req.user._id })
        if (!brand) {
            return   res.status(400).json({ message: 'fail to add Brand' })
        } else {
            return  res.status(201).json({ message: 'created succefully', brand })
        }
    }
    catch (error) {
        res.status(401).json({ message: 'catch create brand', error })

    }
}



export const updateBrand = async (req, res) => {
    try {

        if (req.file) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'Ecommerce/brand' })
            req.body.image = secure_url;
            req.body.ImagePublicId = public_id;
        }
        const { id } = req.params;

        if (req.body.name) {
            req.body.brandName = req.body.name;
            req.body.slug = slugify(req.body.name)
        }

        const brand = await brandModel.findByIdAndUpdate({_id:id}, req.body, { new: false })
        if (req.file) {
            await cloudinary.uploader.destroy(brand.ImagePublicId)
        }
        if (!brand) {
            res.status(400).json({ message: 'fail to update brand' })
        } else {
            res.status(201).json({ message: 'updated succefully', brand })
        }

    } catch (error) {
        res.status(401).json({ message: 'catch created brand ', error })

    }

}
export const getAllbrands = async (req, res) => {
    try {
        const { page, size } = req.query; // for pagination 
        const { skip, limit } = pagination(page, size)
        const brand = await brandModel.find({})
            .limit(limit).skip(skip)
            .populate({
                path: 'createdBy',
                select: 'userName'
            })
        if (!brand) {
            res.status(400).json({ message: 'fail to get brand' })
        } else {
            res.status(201).json({ message: ' success', brand })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch get brand ', error })
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