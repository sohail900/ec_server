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
    const cookies = req.cookies.otpToken
    if (!cookies) {
        return next(new ErrorHandler(400, 'Unauthorized User'))
    }
    try {
        const decoded = jwt.verify(
            cookies,
            process.env.PASSRESALT as string
        ) as JwtPayload
        const user = await AuthUser.findById({ _id: decoded.id })
        req.user = user
        next()
    } catch (error: any) {
        next(new ErrorHandler(401, 'Unauthorized Access'))
    }
}
