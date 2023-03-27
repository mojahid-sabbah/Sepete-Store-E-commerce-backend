import {Router} from 'express'
import {myMulter,validationtype,HME} from '../../services/multer.js';
import {auth} from '../../../middlewear/auth.js';
import * as cart from './cart.controller/cart.controller.js';
   
const router = Router();
 
  router.post('/' ,auth(),cart.Addtocart)
//  router.delete('/:productId/delete' ,auth(),Wishlist.DeleteWishlist)
// router.get('/getAllCat' ,subCategoryController.getAllsubCat)
// router.get('/getcategory/:id' ,subCategoryController.getsubCategory )  
 

export default router