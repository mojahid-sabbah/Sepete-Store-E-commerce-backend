import { categoryModel } from "../../../../DB/models/category.model.js";
import { brandModel } from "../../../../DB/models/brand.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from 'slugify';
import { pagination } from '../../../services/pagination.js'
import { couponModel } from "../../../../DB/models/coupon.model.js";
import moment from "moment/moment.js";

export const createcoupon = async (req, res) => {
    try {
        const { name } = req.body;
        const coupon = await couponModel.findOne({ name: name })
        if (coupon) {
            return res.status(401).json({ message: 'coupon already exist' })
        } else {
            req.body.createdBy = req.user._id
            const newcoupon = await couponModel.create(req.body)
            if (newcoupon) {
                return res.status(401).json({ message: 'successe coupon  ', newcoupon })

            } else {
                return res.status(401).json({ message: 'fail to add coupon' })

            }
        }
    }
    catch (error) {
        res.status(401).json({ message: 'catch create brand', error })

    }
}



export const updatecoupon = async (req, res) => {
    try {

        const { id } = req.params;
        const coupon = await couponModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
        if (coupon) {
            return res.status(401).json({ message: 'successe coupon  ', coupon })
        } else {
            return res.status(401).json({ message: 'fail to update coupon' })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch created brand ', error })

    }

}
export const deletcoupon = async (req, res) => {
    try {

        const { id } = req.params;
        const coupon = await couponModel.findOneAndDelete({ _id: id })
        if (coupon) {
            return res.status(401).json({ message: 'successe deleted coupon  ' })
        } else {
            return res.status(401).json({ message: 'fail to delet coupon' })
        }
    } catch (error) {
        res.status(401).json({ message: 'catch created brand ', error })

    }

}
export const validCoupon = async (req, res) => {
    try {
        let now = moment()
        
        let coupons = await couponModel.find({})
        let data = []
        for (let coupon of coupons) {
            let exp = coupon.expireDate;
            let diff = now.diff(exp, 'days')
             if (diff < 0) {
                data.push(coupon)
            }
        }
     return   res.status(200).json({ message: 'success ', data })

    } catch (error) {
      return  res.status(401).json({ message: 'catch validCoupon ', error })
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