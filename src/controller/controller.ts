import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { randomInt } from 'crypto'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import cheerio from 'cheerio'
import AuthUser from '../schema/dbSchema'
import { ErrorHandler } from '../errorHandler/errorHandler'
import { IRequest, IUser } from '../types/types'
import { resetPasswordMail } from '../utility/nodemailer'
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
        resetPasswordMail('blockchain2221@gmail.com', otp)
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
                message: 'This OTP does not exists!!',
            })
        }
        const resetToken = jwt.sign(
            { email: user?.email },
            process.env.PASSRESALT as string
        )
        resp.status(200)
            .cookie('otpToken', resetToken, {
                httpOnly: true,
            })
            .json({
                success: true,
                message: 'successfully check otp',
            })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
}
const reset_password = async (
    req: IRequest,
    resp: Response,
    next: NextFunction
) => {
    try {
        const user = req.user
        const newPassword = req.body.newPassword
        // Manually hash the new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        const updatedPassword = await AuthUser.findOneAndUpdate(
            { _id: user._id },
            { $set: { password: hashedPassword, otp: 0 } },
            { new: true }
        )
        resp.status(200).json({
            success: true,
            message: 'successful updated password',
            updatedPassword,
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
}
// web scraping extract data from nike website
const nikeScraper = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    try {
        const { data } = await axios.get(
            'https://www.nike.com/id/w/mens-football-shoes-1gdj0znik1zy7ok'
        )
        const $ = cheerio.load(data)
        console.log($.html())
        $('div.product-card__body').each(async (index, element) => {
            // Extract product details
            console.log(element)
            const price = $(element).find('div.product-price').text().trim()
            // Create a new Product object and save to MongoDB
            console.log(price)
        })
    } catch (error: any) {
        next(new ErrorHandler(400, error.message))
    }
}
export { register, login, otp, forget_password, reset_password, nikeScraper }
