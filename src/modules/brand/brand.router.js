import {Router} from 'express'
import {myMulter,validationtype,HME} from '../../services/multer.js';
import {auth} from '../../../middlewear/auth.js';
import * as brandController from './brand.controller/brand.controller.js';
  
const router = Router();
 
router.post('/createbrand' ,auth( ), myMulter(validationtype.image).single('image'),HME,brandController.createBrand)
  router.put('/update/:id' ,auth( ), myMulter(validationtype.image).single('image'),HME,brandController.updateBrand)
 router.get('/getBrands' ,brandController.getAllbrands)
// router.get('/getcategory/:id' ,subCategoryController.getsubCategory )  


export default router