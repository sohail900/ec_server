import nodemailer from 'nodemailer'
import { ErrorHandler } from '../errorHandler/errorHandler'

export const resetPasswordMail = async (
    email: string | undefined,
    otp: number
) => {
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sohailbalti000@gmail.com',
                pass: 'gyfidmxtulzpufhv',
            },
        })
        //sending config
        const emailConfig = {
            from: '"CoolKick Team" <rossie.damore@ethereal.email',
            to: email,
            subject: 'Reset Password',
            html: `<h1>RESET PASSWORD</h1><br></br><h2>OTP : ${otp}</h2>`,
        }
        const msgInfo = await transport.sendMail(emailConfig, (err, info) => {
            if (err) new ErrorHandler(500, 'server error')
            else console.log(info)
        })
        console.log(msgInfo)
    } catch (error: any) {
        throw new ErrorHandler(400, error.message)
    }
}
