import { Router } from 'express'
import {
    login,
    register,
    forget_password,
    reset_password,
    otp,
} from '../controller/controller'
import resetPassAuth from '../auth/resPassAuth'
const router = Router()

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/forget_password').put(forget_password)
router.route('/otp').post(otp)
router.route('/reset_password').get(resetPassAuth, reset_password)
export default router
