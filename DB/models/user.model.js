import { model, Schema, Types } from 'mongoose';

const userSchema = new Schema({
    userName: {
        type: String, required: [true, 'userName is requierd'],
        min: [3, 'min length is 3'], max: [25, 'max length is 25']
    },

    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    phone: String,
    gender: { type: String, enum: ['male', 'female'], default: 'male', },
    confirmEmail: { type: Boolean, default: false, },
    blocked: { type: Boolean, default: false, },
    role: { type: String, enum: ['client', 'admin'], default: 'client' },
    sendCode: { type: String, default: null },
    age: Number,
    profilePic: String, //image
    wishlist: [{ type: Types.ObjectId, ref: "product" }]
}, { timestamps: true })

export const userModel = model('user', userSchema)
