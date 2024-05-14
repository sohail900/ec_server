import { Request, Response, NextFunction } from 'express'
export const errorMiddleware = (
    err: Error & { statusCode: number },
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode | 500
    err.message = err.message as string | 'Server Failed To Response'
    resp.status(err.statusCode).json({ success: false, message: err.message })
}
