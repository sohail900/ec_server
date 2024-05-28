import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import AuthUser from '../schema/dbSchema'
import { ErrorHandler } from '../errorHandler/errorHandler'
import { IRequest } from '../types/types'
export default async function resetPassAuth(
    req: IRequest,
    resp: Response,
    next: NextFunction
) {
    try {
        const cookies = req.cookies.otpToken
        if (!cookies) {
            return next(new ErrorHandler(400, 'Unauthorized User'))
        }
        const decoded = jwt.verify(
            cookies,
            process.env.PASSRESALT as string
        ) as JwtPayload
        console.log(decoded)
        if (!decoded || !decoded.id) {
            return next(new ErrorHandler(401, 'Unauthorized Access'))
        }
        const user = await AuthUser.findById({ _id: decoded.id })
        req.user = user
        next()
    } catch (error: any) {
        next(new ErrorHandler(401, 'Unauthorized Error'))
    }
}
