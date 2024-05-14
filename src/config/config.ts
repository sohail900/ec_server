import env from 'dotenv'
import mongoose from 'mongoose'
env.config()

mongoose
    .connect(`${process.env.DATABASE}/cooldb`)
    .then(() => {
        console.log('successful connected to db')
    })
    .catch((e) => {
        console.log(e)
    })
