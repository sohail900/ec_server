import { model, Schema } from 'mongoose'
import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ErrorHandler } from '../errorHandler/errorHandler'
const SALT = process.env.SALT
const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})
//encrypted password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error: any) {
        throw new ErrorHandler(409, error.message)
    }
})
UserSchema.methods.comparePassword = async function (password: string) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw new ErrorHandler(409, 'Password Not Matched')
    }
}
UserSchema.methods.generateToken = async function () {
    try {
        const token = jwt.sign({ id: this._id }, SALT as string)
        return token
    } catch (error: any) {
        throw new ErrorHandler(409, error.message)
    }
}
export default model('auth_user', UserSchema)
