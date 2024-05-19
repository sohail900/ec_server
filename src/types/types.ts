import { Document } from 'mongoose'
import { Request } from 'express'
export interface IUser extends Document {
    comparePassword: (password: string) => Promise<boolean>
    generateToken: () => Promise<string>
}
export interface IRequest extends Request {
    user?: any
}
