import { connection } from "../server.js";
import customerSchema from "../schemas/customerSchema.js";
import dayjs from "dayjs";


export async function insertCustomer (req, res) {

    const customer = req.body


    const customerRegistered = await connection.query("SELECT * FROM customers WHERE cpf = $1", [customer.cpf])
    const validation  = customerSchema.validate(customer)

    if(customerRegistered.rowCount > 0){
        return res.sendStatus(409)
    }
    if(validation.error){
        console.log(validation.error)
        return res.sendStatus(400)
    }

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`, 
        [customer.name, customer.phone, customer.cpf, customer.birthday])
        console.log(customer.birthday)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function getCustomers (req, res) {
    
    try{
        const customers = await connection.query("SELECT id, name, phone, cpf, TO_CHAR(birthday::date,'yyyy-mm-dd') as birthday FROM customers")
        res.status(200).send(customers.rows)
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function updateCustomer (req, res) {

    const customerId = req.params.id
    const customer = req.body

    const customerRegistered = await connection.query("SELECT * FROM customers WHERE cpf = $1", [customer.cpf])
    const validation  = customerSchema.validate(customer)

    if(customerRegistered.rows[0].cpf !== customer.cpf && customerRegistered.rowCount !== 0 ){
        return res.sendStatus(409)
    }
    if(validation.error){
        console.log(validation.error)
        return res.sendStatus(400)
    }

    try{
        await connection.query(`UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
        [customer.name, customer.phone, customer.cpf, customer.birthday, customerId])
        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}