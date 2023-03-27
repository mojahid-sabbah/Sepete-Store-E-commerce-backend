import {Router} from 'express'
import {myMulter,validationtype,HME} from '../../services/multer.js';
import {auth} from '../../../middlewear/auth.js';
import * as subCategoryController from './subCategory.controller/subCategory.controller.js';
 
const router = Router();
 
router.post('/:categoryId/createCat' ,auth( ), myMulter(validationtype.image).single('image'),HME,subCategoryController.createsubCategory)
router.put('/:categoryId/update/:id' ,auth( ), myMulter(validationtype.image).single('image'),HME,subCategoryController.updatesubCategory)
router.get('/getAllCat' ,subCategoryController.getAllsubCat)
router.get('/getcategory/:id' ,subCategoryController.getsubCategory )  


export default router