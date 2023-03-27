import { Router } from 'express'
import { myMulter, validationtype, HME } from '../../services/multer.js';
import { auth } from '../../../middlewear/auth.js';
import * as productController from './product.controller/product.controller.js';
import reviewRouter from '../review/review.router.js'

const router = Router();

//router.use('/:productId/wishlist' , wishlistRouter)
router.use('/:productId/review' , reviewRouter)
router.patch('/addProduct', auth(), myMulter(validationtype.image).array('images', 5), HME, productController.addProduct)
router.put('/:id', auth(), myMulter(validationtype.image).array('images', 5), HME, productController.updateproduct)
router.get('/getAllpro', productController.getAllproduct)
// router.get('/getcategory/:id' ,productController.getCategory )  

export default router