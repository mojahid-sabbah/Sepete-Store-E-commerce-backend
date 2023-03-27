import {model ,Schema, Types} from'mongoose';

const subcategorySchema = new  Schema({
    subcategoryName:      {type:String,
                        unique:[true,'subcategory must be uniuqe'] ,
                        required:[true, 'subcategoryName is requierd'],
                        min:[3,'min length is 3'] ,max:[25,'max length is 25'] },
                       
    slug:      {type:String} ,
    image:         [String],
    createdBy:      {type:Types.ObjectId, ref:'user' ,  required:[true, 'category owner is required'],},

    categoryId:      {type:Types.ObjectId, ref:'category' ,  required:[true, 'subcategory owner is required'],},
     ImagePublicId:String,
 }, {timestamps:true})

export const subcategoryModel = model('subcategory' , subcategorySchema) 
 