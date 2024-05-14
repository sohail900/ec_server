import { Document } from 'mongoose'
export interface IUser extends Document {
    comparePassword: (password: string) => Promise<boolean>
    generateToken: () => Promise<string>
}
