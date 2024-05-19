import { Request, Response, NextFunction } from 'express'
import { randomInt, randomBytes } from 'crypto'
import AuthUser from '../schema/dbSchema'
import { ErrorHandler } from '../errorHandler/errorHandler'
import { IRequest, IUser } from '../types/types'
import { resetPasswordMail } from '../config/nodemailer'
import jwt from 'jsonwebtoken'
const register = async (req: Request, resp: Response, next: NextFunction) => {
    try {
        //check email
        const checkEmail = await AuthUser.findOne({ email: req.body.email })
        if (checkEmail) {
            next(new ErrorHandler(409, 'Email Already Exists'))
            return
        }
        const data = await AuthUser.create({ ...req.body })
        resp.status(200).json({ success: true, data: data })
    } catch (error: any) {
        console.log(error)
        next(new ErrorHandler(400, error.message))
    }
}
const login = async (req: Request, resp: Response, next: NextFunction) => {
    try {
        //check data
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
const forget_password = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    try {
        const email = req.body.email
        ///check email
        const data = await AuthUser.findOne({ email })
        if (!data) {
            resp.status(200).json({
                success: true,
                message: 'This Email does not exists!!',
            })
        }
        const otp = randomInt(100000, 900000)
        resetPasswordMail(data?.email, otp)
        const updatedUser = await AuthUser.findOneAndUpdate(
            { email },
            { $set: { otp } },
            { new: true }
        )
        resp.status(200).json({
            success: true,
            updatedUser,
            message: 'successful send to you gmail',
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
}
const otp = async (req: Request, resp: Response, next: NextFunction) => {
    try {
        const otp = req.body.otp
        const user = await AuthUser.findOne({ otp })
        if (!user) {
            resp.status(200).json({
                success: true,
                message: 'OTP not matched',
            })
        }
        console.log('hello world')
        const resetToken = jwt.sign(
            { email: user?.email },
            process.env.PASSRESALT as string
        )
        resp.status(200).cookie('otpToken', resetToken).json({
            success: true,
            message: 'successfully check otp',
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
}
const reset_password = (req: IRequest, resp: Response, next: NextFunction) => {
    const user = req.user
}
export { register, login, otp, forget_password, reset_password }
