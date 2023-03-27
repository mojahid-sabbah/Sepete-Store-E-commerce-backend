import {Router} from 'express'
import {myMulter,validationtype,HME} from '../../services/multer.js';
import {auth} from '../../../middlewear/auth.js';
import * as CatController from './category.controller/category.controller.js';
import  subcategoryRouter  from '../subCategory/subCategory.router.js';
   
const router = Router(); 
   
router.use('/subcategory', subcategoryRouter) // internal navigate
 
router.patch('/createCat' ,auth( ), myMulter(validationtype.image).single('image'),HME,CatController.createCategory)
router.put('/:id' ,auth( ), myMulter(validationtype.image).single('image'),HME,CatController.updateCategory)
 router.get('/getAllCat' ,CatController.getAllCat)
router.get('/getcategory/:id' ,CatController.getCategory )  

export default router