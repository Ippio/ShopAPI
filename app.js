require('dotenv').config()
require('express-async-errors')

//packages
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit')

//express
const express = require('express')
const app = express()

//database
const connectBD = require('./db/connect')

//routes
const fptRouter = require('./routes/fpt')
const database = require('./routes/database')
const productRouter = require('./routes/productRoutes')
const authRouter = require('./routes/authRoutes')
const orderRouter = require('./routes/orderRoutes')

//middlewware
const notFound = require('./middleware/not-found')

app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.urlencoded({ extended: false }))
app.use('/',express.static('./public'))
app.use('/',fptRouter)
app.use('/',database)
app.use('/',productRouter)
app.use('/',authRouter)
app.use('/',orderRouter)
app.use(rateLimiter({ windowMs: 60 * 1000, max: 150 }))
app.use('/',notFound)

const port =  5000

//star server
const start = async () => {
    try {
        await connectBD(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}
start()


