import { model, Schema, Types } from 'mongoose';

const couponSchema = new Schema({
    name: {
        type: String,
        trim: true,//remove spaces around the name
        unique: [true, 'coupon must be uniuqe'],
        required: [true, 'couponName is requierd'],
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25']
    },

    createdBy: { type: Types.ObjectId, ref: 'user', required: [true, 'category owner is required'], },
    usedBy: [{ type: Types.ObjectId, ref: 'user' }],
    expireDate: Date,
    amount: {  type:Number, max: [100, 'max num is 100%'], min: [1, 'min num is 1%'], }
}, { timestamps: true })

export const couponModel = model('coupon', couponSchema)
