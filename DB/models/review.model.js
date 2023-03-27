import { model, Schema, Types } from 'mongoose';

const reviewSchema = new Schema({
    message: { type: String, required: [true, 'reviewName is requierd'] },
    userId: { type: Types.ObjectId, ref: 'user', required: [true, 'user id is required'], },
    productId: { type: Types.ObjectId, ref: 'product', required: [true, 'product id is required'], },
    userId: { type: Types.ObjectId, ref: 'user', required: [true, 'user id is required'], },
    rating: {
        type: Number,
        default: 1,
        min: [1, "min is 1"],
        max: [5, "max is 5"],
    },

}, { timestamps: true })

export const reviewModel = model('review', reviewSchema)
