import { connection } from "../server.js"



export async function createCategory (req, res) {

    const category = req.body.name
    const exists = await connection.query("SELECT * FROM categories WHERE name=$1", [category])
    
    if(!category){
        return res.sendStatus(400)
    }

    if(exists.rowCount > 0){
        return res.sendStatus(409)
    }

    try {
        await connection.query('INSERT INTO "categories" ("name") VALUES ($1)', [category])
        res.status(201).send("Categoria Criada!")
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function getCategories (req, res) {

    try {
        const categories = await connection.query("SELECT * FROM categories")
        res.status(200).send(categories.rows)
    } catch (err) {
        res.sendStatus(500)
    }
}