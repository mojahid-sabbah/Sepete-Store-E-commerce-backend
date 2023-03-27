import { model, Schema, Types } from 'mongoose';

const cartSchema = new Schema({

    userId: { type: Types.ObjectId, ref: 'user', unique: [true, '  owner is required'], },
    products: [{
        productId: { type: Types.ObjectId, ref: 'product' },
        quantity: { type: Number, default: 1 }
    }],

}, { timestamps: true })

export const cartModel = model('cart', cartSchema)
