import {Router} from 'express'
import * as authcontroller from './auth.controller/auth.controller.js';
import { validation } from '../../../middlewear/validation.js';
import  * as authValidate from './auth.validation.js';
 
const router = Router();
   
router.post('/signup' ,validation(authValidate.signup), authcontroller.signup)
router.post('/signin' , validation(authValidate.signin),authcontroller.signin)
router.get('/confirmEmail/:token' , authcontroller.confirmEmail)
router.get('/RFToken/:reFreshToken' , authcontroller.reFreshToken)

export default router