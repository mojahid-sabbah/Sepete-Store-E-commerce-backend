import {Router} from 'express'
import {myMulter,validationtype,HME} from '../../services/multer.js';
import {auth} from '../../../middlewear/auth.js';
import * as Wishlist  from './wishlist.controller/wishlist.controller.js';
//const router = Router({mergeParams:true});  
const router = Router();
 
 router.patch('/:productId/add' ,auth(),Wishlist.AddtoWishlist)
 router.delete('/:productId/delete' ,auth(),Wishlist.DeleteWishlist)
// router.get('/getAllCat' ,subCategoryController.getAllsubCat)
// router.get('/getcategory/:id' ,subCategoryController.getsubCategory )  


export default router