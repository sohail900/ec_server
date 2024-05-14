import { Request, Response, NextFunction } from 'express'
import AuthUser from '../schema/dbSchema'
import { ErrorHandler } from '../errorHandler/errorHandler'
import { IUser } from '../types/types'
const Register = async (req: Request, resp: Response, next: NextFunction) => {
    try {
        //check email
        const checkEmail = await AuthUser.findOne({ email: req.body.email })
        if (checkEmail) {
            next(new ErrorHandler(409, 'Email Already Exists'))
            return
        }
        const user = await AuthUser.create({ ...req.body })
        resp.status(200).json({ success: true, data: user })
    } catch (error: any) {
        console.log(error)
        next(new ErrorHandler(400, error.message))
    }
}
const Login = async (req: Request, resp: Response, next: NextFunction) => {
    try {
        //check user
        const checkUser = (await AuthUser.findOne({
            email: req.body.email,
        })) as IUser
        if (
            !checkUser ||
            !(await checkUser.comparePassword(req.body.password))
        ) {
            next(new ErrorHandler(401, 'User Not Found'))
            return
        }
        ///generate token
        const token = await checkUser.generateToken()
        resp.status(200).json({
            message: 'Welcome To Home',
            success: true,
            token,
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
}
export { Register, Login }
