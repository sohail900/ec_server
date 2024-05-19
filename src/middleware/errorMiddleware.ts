import { Request, Response, NextFunction } from 'express'
export const errorMiddleware = (
    err: Error & { statusCode: number },
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    err.message = err.message as string | 'Server Failed To Response'
    err.statusCode = err.statusCode as number | 500
    resp.status(err.statusCode).json({ success: false, message: err.message })
}
