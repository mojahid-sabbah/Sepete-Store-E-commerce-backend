import { Router } from 'express'
import { myMulter, validationtype, HME } from '../../services/multer.js';
import { auth } from '../../../middlewear/auth.js';
import * as reviewController from './review.controller/review.controller.js';

const router = Router({mergeParams:true}); 


 router.patch('/add', auth()  ,reviewController.createreview)
// router.put('/:id', auth(), myMulter(validationtype.image).array('images', 5), HME, productController.updateproduct)
// router.get('/getAllpro', productController.getAllproduct)
//   router.get('/getcategory/:id' ,productController.getCategory )  

export default router