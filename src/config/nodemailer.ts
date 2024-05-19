import nodemailer from 'nodemailer'
import { ErrorHandler } from '../errorHandler/errorHandler'

export const resetPasswordMail = (email: string | undefined, otp: number) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPASSWORD,
            },
        })
        //sending config
        const emailConfig = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            html: `<h1>RESET PASSWORD</h1><br></br><h2>OTP : ${otp}</h2>`,
        }
        transport.sendMail(emailConfig, (err, info) => {
            if (err) new ErrorHandler(500, 'server error')
            else console.log(info)
        })
    } catch (error: any) {
        throw new ErrorHandler(400, error.message)
    }
}
