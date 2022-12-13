import { connection } from "../server.js";
import gameSchema from "../schemas/gameSchema.js";



export async function insertGame (req, res) {

    const game  = req.body
    const validation = gameSchema.validate(game)
    const categoryExists = await connection.query("SELECT * FROM categories WHERE id = $1", [game.categoryId])
    const alreadyRegistered = await connection.query("SELECT * FROM games WHERE name = $1", [game.name])


    if(categoryExists.rowCount === 0 || validation.error){
        return res.sendStatus(400)
    }
    if(alreadyRegistered.rowCount > 0){
        return res.status(409).send("Jogo já cadastrado!")
    }

    try{
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1,$2,$3,$4,$5)
        `, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay])
        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }

}

export async function getGames (req, res) {

    const name = req.query.name
    
    try{

        if(name) {
            const games = await connection.query(`SELECT * FROM games WHERE name ILIKE $1`, [`%${name}%`])
            return res.status(200).send(games.rows)
        }

        const games = await connection.query("SELECT * FROM games")
        res.status(200).send(games.rows)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
    
}