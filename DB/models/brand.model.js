import {model ,Schema, Types} from'mongoose';

const brandSchema = new  Schema({
    brandName:      {type:String,
                        unique:[true,'brand must be uniuqe'] ,
                        required:[true, 'brandName is requierd'],
                        min:[3,'min length is 3'] ,max:[25,'max length is 25'] },
                       
    slug:      {type:String} ,
    image:         [String],
    createdBy:      {type:Types.ObjectId, ref:'user' ,  required:[true, 'category owner is required'],},

      ImagePublicId:String,
 }, {timestamps:true})

export const brandModel = model('brand' , brandSchema) 
 