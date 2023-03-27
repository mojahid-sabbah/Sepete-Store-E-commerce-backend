import { couponModel } from "../../../../DB/models/coupon.model.js";
import { orderModel } from "../../../../DB/models/order.model.js";
import { productModel } from "../../../../DB/models/product.model.js";

export const addOrder = async (req, res) => {
    try {
        const { phone, address, products, couponId } = req.body;
        let sumTotal = 0;
        let finalList = []
        for (let i = 0; i < products.length; i++) {
            const checkItem = await productModel.findOne(
                {  // الشروط
                    _id: products[i].productId,
                    stock: { $gte: products[i].quantity }// That mean >> == if(stock >products[i].quantity )
                })
            if (!checkItem) {
                return res.status(400).json({ message: 'invalid order ' })

            } else {
                products[i].totalPrice = checkItem.finalPrice * products[i].quantity; // مجموع اسعار المنتجات
                sumTotal += products[i].totalPrice;
                finalList.push(products[i])
            }
        }
        req.body.totalPrice = sumTotal // مجموع كل الطلبات
        if (couponId) {
            const checkCoupon = await couponModel.findOne({ _id: couponId, usedBy: { $nin: req.user._id } })
            if (checkCoupon) {
                return res.status(400).json({ message: 'invalid coupon ' })
            }else{
                req.body.totalPrice = sumTotal - (sumTotal*(checkCoupon.amount/100))  // المجموع الكلي مع اكوبون اذا موجود
            }
        }

        req.body.userId = req.user._id;
        req.body.products = finalList;
        const neworder = await orderModel.create(req.body)
        if(neworder){
            if(couponId){
                await couponModel.findByIdAndUpdate(couponId,{$addToSet:{usedBy:req.user._id}})
            }
            return res.status(200).json({ message: 'Order Added Success ', neworder })
        }else{
            return res.status(400).json({ message: 'Order Added failed ' })

        }




    } catch (error) {
        return res.status(400).json({ message: 'catch created order ', error })

    }
}