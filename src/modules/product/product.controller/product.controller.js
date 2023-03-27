import { categoryModel } from "../../../../DB/models/category.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from 'slugify';
import { pagination } from '../../../services/pagination.js'
import { subcategoryModel } from "../../../../DB/models/subCategory.model.js";
import { brandModel } from "../../../../DB/models/brand.model.js";
import { productModel } from "../../../../DB/models/product.model.js";

export const addProduct = async (req, res) => {
    try {
         if (!req.files?.length) {
            res.status(400).json({ message: 'image is required' })
        } else {
            const { name, amount, price,desc, discount, categoryId, subcategoryId, brandId } = req.body;
            if (!name || !amount || !price || !categoryId || !subcategoryId || !brandId) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            req.body.productName = name
 
            req.body.slug =slugify(name, '_')
            req.body.stock = parseInt(amount);
            req.body.finalPrice = (price - (price * ((parseInt(discount) || 0) / 100)))

            const subcategory = await subcategoryModel.findOne({ _id: subcategoryId, categoryId })

            if (!subcategory) {
                return res.status(400).json({ message: 'this sub_category is NOT exist' })
            }
            const brand = await brandModel.findOne({ _id: brandId })

            if (!brand) {
                return res.status(400).json({ message: 'this brand is NOT exist' })
            }
            let images = [];
            let imagePublicId = [];
            for (const file of req.files) {  //                                   (file) item from for loop
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Ecommerce/product/${name}` })
                images.push(secure_url);
                imagePublicId.push(public_id);
            }
            // here to add to DB
            req.body.images = images;
            req.body.imagePublicId = imagePublicId;
            req.body.createdBy = req.user._id;

            
            // const product = await productModel.create({createdBy : req.user._id,name, amount,desc, price, discount, categoryId, subcategoryId, brandId})
            const product = new productModel(req.body);
            //return res.status(201).json(  product )
            const savedproduct = await product.save();
            if (!savedproduct) {
                return res.status(400).json({ message: 'fail to add product' })
            } else {
                return res.status(201).json({ message: 'created succefully', savedproduct })
            }
        }
    } catch (error) {
        return res.status(400).json({ message: 'catch created product ', error })

    }
}


export const updateproduct = async (req, res) => {
    try {


        const { id } = req.params;
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, amount, desc, price, discount, categoryId, subcategoryId, brandId } = req.body;

        if (name) {
            req.body.slug = slugify(name);
        }

        if (amount) {
            let calcstock = amount - product.soldItems;

            if (calcstock > 0) {
                req.body.stock = calcstock;
            } else {
                req.body.stock = 0;
            }
        }

        if (price && discount) {
            req.body.finalPrice = price - (price * (parseInt(discount) / 100));
        } else if (price) {
            req.body.finalPrice = price - (price * (parseInt(product.discount) / 100));
        } else if (discount) {
            req.body.finalPrice = product.price - (product.price * (parseInt(discount) / 100));
        }

        if (categoryId && subcategoryId) {
            const subcategory = await subcategoryModel.findOne({ _id: subcategoryId, categoryId });

            if (!subcategory) {
                return res.status(400).json({ message: 'Invalid category or subcategory' });
            }
        }

        if (brandId) {
            const brand = await brandModel.findById(brandId);

            if (!brand) {
                return res.status(400).json({ message: 'Invalid brand' });
            }

            req.body.brandId = brand._id;
        }

        if (req.files.length) {
            let images = [];
            let imagePublicId = [];

            for (const file of req.files) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `Ecommerce/product/${name}` });
                images.push(secure_url);
                imagePublicId.push(public_id);
            }

            req.body.images = images;
            req.body.imagePublicId = imagePublicId;
        }

        const updatedProduct = await productModel.findOneAndUpdate({ _id: product._id }, req.body, { new: false });

        if (updatedProduct) {
            for (const imageid of updatedProduct.imagePublicId) {
                await cloudinary.uploader.destroy(imageid);
            }

            return res.status(200).json({ message: 'Product updated successfully', updatedProduct })
        }

    } catch (error) {
        return res.status(401).json({ message: 'catch created product ', error })

    }

}
export const getAllproduct = async (req, res) => {
    try {
        const { page, size } = req.query; // for pagination 
        const { skip, limit } = pagination(page, size)
        const product = await productModel.find({})
            .limit(limit).skip(skip).select('name image').populate(
                [
                    {
                        path: 'createdBy',
                        select: 'userName image'
                    },
                    {
                        path: 'categoryId',
                        select: 'categoryName image'

                    }, {
                        path: 'subcategoryId',
                        select: 'subcategoryName image'

                    }, {
                        path: 'brandId',
                        select: 'brandName image'

                    },{
                        path:'Virtual_product'  //انشأنا الفييرتوال بالبواكت موديل وهنا قلناله يعرض الفيوز تبعوت المنتج
                    }
                ]
            )
        if (!product) {
            res.status(400).json({ message: 'fail to get product' })
        } else {
            res.status(201).json({ message: ' success', product })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch get product ', error })
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