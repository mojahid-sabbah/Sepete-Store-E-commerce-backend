import { model, Schema, Types } from 'mongoose';

const orderSchema = new Schema({

    userId: { type: Types.ObjectId, ref: 'user'  },
    products: [{
        productId: { type: Types.ObjectId, ref: 'product' },
        quantity: { type: Number, default: 1 },
        totalPrice: { type: Number, default: 1 }
    }],
    address:[String],
    phone:String,
    totalPrice: { type: Number, default: 1 },
    statusCode: { type: String, default: 'pending' ,enum:['pending' , 'cancelled' , 'approved' ,'recived'] },
    paymentMethod : { type: String, default: 'cash' ,enum:['cash' , 'paypal' , 'visa'] },

}, { timestamps: true })

export const orderModel = model('order', orderSchema)
