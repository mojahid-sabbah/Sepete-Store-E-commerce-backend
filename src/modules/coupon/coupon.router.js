import {Router} from 'express'
import {myMulter,validationtype,HME} from '../../services/multer.js';
import {auth} from '../../../middlewear/auth.js';
import * as couponController from './coupon.controller/coupon.controller.js';
  
const router = Router();
 
router.post('/createcoupon' ,auth(['admin'] ), couponController.createcoupon)
router.put('/:id' ,auth(['admin'] ), couponController.updatecoupon)
router.delete('/:id' ,couponController.deletcoupon)
  router.get('/valid' ,couponController.validCoupon )  


export default router