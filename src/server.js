import experess from 'express'
import cors from 'cors'
import pg from 'pg'
import categoriesRouter from './routes/categoriesRoute.js'
import gamesRoute from './routes/gamesRoute.js'
import customersRoute from './routes/customersRoute.js'
import dotenv from 'dotenv'
import rentalRoute from './routes/rentalRoute.js'
dotenv.config()

const {Pool} = pg 
export const connection = new Pool({
    connectionString: process.env.DATABASE_URL
})


const app = experess()

app.use(experess.json())
app.use(cors())
app.use(categoriesRouter)
app.use(gamesRoute)
app.use(customersRoute)
app.use(rentalRoute)



app.listen(4000, () => console.log("rodando na porta 4000"))