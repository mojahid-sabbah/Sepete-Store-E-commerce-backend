import { model, Schema, Types } from 'mongoose';

const productSchema = new Schema({
    productName: {
        type: String,
        unique: [true, 'product name must be uniuqe'],
        required: [true, 'product Name is requierd'],
        min: [3, 'min length is 3'],
        max: [25, 'max length is 25'],
        trim: true,
    },
    slug: { type: String },
    desc: { type: String, required: true },
    images: [String],
    imagePublicId: [String],
    amount: { type: Number, default: 0 },//كمية
    soldItems: { type: Number, default: 0 },//كم بعت
    stock: { type: Number, default: 0 },//المتبقي
    price: { type: Number, default: 0, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 0 },
    //categories: { type: Array },
    size: {
        type: String,
        enum: ['xs', 's', 'm', 'l', 'xl'],
        default: 'm'
    },
    color: { type: String },
    createdBy: { type: Types.ObjectId, ref: 'user', required: [true, 'product owner is required'], },
    categoryId: { type: Types.ObjectId, ref: 'category' },
    subcategoryId: { type: Types.ObjectId, ref: 'subcategory' },
    brandId: { type: Types.ObjectId, ref: 'brand' },

}, { timestamps: true ,toJSON:{virtuals:true},toObject:{virtuals:true}})

productSchema.virtual('Virtual_product',{
    ref:'review', // ref to model 
    localField:'_id', // ref field from this model (for example >> (_id) of this product model )
    foreignField:'productId' // ref field from related model (subproduct >> = productId)
    })
export const productModel = model('product', productSchema)
