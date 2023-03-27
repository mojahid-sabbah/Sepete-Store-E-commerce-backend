import { reviewModel } from "../../../../DB/models/review.model.js";

export const createreview = async (req, res) => {
    try {
        const { _id } = req.user;
        const { message, rating } = req.body;
        const { productId } = req.params;
        const checkReview = await reviewModel.findOne({ userId: _id, productId })
        if (checkReview) {
            return res.status(200).json({ message: 'allready reviewed ' })
        } else {
            const checkOrder = await orderModel.findOne({ userId: _id, "products.productId": productId, statusCode: "approved" })
            if (!checkOrder) {

                return res.status(401).json({ message: 'cant reviewed ' })
            } else {
                const review = await reviewModel.create({ userId: _id, productId, message, rating })
                return res.status(200).json({ message: 'success ', review })

            }

        }

    } catch (error) {
        return res.status(400).json({ message: 'catch created product ', error })

    }
}