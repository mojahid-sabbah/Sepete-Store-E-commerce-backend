import {model ,Schema, Types} from'mongoose';

const categorySchema = new  Schema({
    categoryName:      {type:String,
                        unique:[true,'category must be uniuqe'] ,
                        required:[true, 'categoryName is requierd'],
                        min:[3,'min length is 3'] ,max:[25,'max length is 25'] },
                       
    slug:      {type:String} ,
    image:         [String],
    createdBy:      {type:Types.ObjectId, ref:'user' ,  required:[true, 'category owner is required'],},
     ImagePublicId:String,
 }, {
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})//                  V _ name of virtual
categorySchema.virtual('Virtual_subCategory',{
ref:'subcategory', // ref to model 
localField:'_id', // ref field from this model (for example >> (_id) of this category model )
foreignField:'categoryId' // ref field from related model (subcategory >> = categoryId)
})
export const categoryModel = model('category' , categorySchema) 
 