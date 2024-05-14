import { Router, Request, Response, NextFunction } from 'express'
import { Login, Register } from '../controller/controller'
import { ErrorHandler } from '../errorHandler/errorHandler'
const router = Router()

router.route('/').post((req: Request, resp: Response, next: NextFunction) => {
    try {
        const text = req.body.texts
        console.log(text)
    } catch (error) {
        throw new ErrorHandler(401, 'Fuckin gError')
    }
})
router.route('/login').post(Login)
router.route('/register').post(Register)
export default router
