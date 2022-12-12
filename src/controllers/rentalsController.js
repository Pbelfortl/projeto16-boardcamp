import { connection } from "../server.js";
import dayjs from "dayjs";
import duration from "dayjs";



export async function rentGame (req, res) {

    const {customerId, gameId, daysRented} = req.body

    const customer = (await connection.query("SELECT * FROM customers WHERE id = $1", [customerId])).rows[0]
    const game = (await connection.query("SELECT * FROM games WHERE id=$1", [gameId])).rows[0]

    if( !customer || !game || daysRented < 1 || game.stockTotal < 1){
        return res.sendStatus(400)
    }

    try{

        await connection.query(`
                INSERT INTO 
                rentals ("customerId", "gameId","rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [customerId, gameId, dayjs().format('YYYY-MM-DD'), daysRented, null, (daysRented*game.pricePerDay), null])

        res.sendStatus(201)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

export async function getRentals (req, res) {

    const rentalReturn = []

    try{
        const rental = await connection.query(`SELECT 
                rentals.id, rentals."customerId", rentals."gameId", rentals."rentDate", rentals."daysRented", rentals."returnDate", rentals."originalPrice", rentals."delayFee",
                customers.id,  customers.name,customers.phone, customers.cpf, customers.birthday,
                games.id, games.name AS "gameName", games.image, games."stockTotal", games."categoryId", games."pricePerDay",
                categories.id, categories.name AS "categoryName"
                 FROM rentals JOIN customers ON rentals."customerId" = customers.id 
                 JOIN games ON rentals."gameId" = games.id
                 JOIN categories ON games."categoryId" = categories.id`)
        rental.rows.forEach(element => {
            rentalReturn.push({
                id: element.id,
                customerId: element.customerId,
                gameId: element.gameId,
                rentDate: element.rentDate,
                daysRented: element.daysRented,
                returnDate: element.returnDate,
                originalPrice: element.originalPrice,
                delayFee: element.delayFee,
                customer:{
                    id: element.customerId,
                    name:element.name,
                },
                game: {
                    id:element.gameId,
                    name:element.gameName,
                    categoryId:element.categoryId,
                    categoryName:element.categoryName
                }
            })
        });
        res.status(200).send(rentalReturn)
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
}

export async function returnGame (req, res) {

    const rentalId = req.params.id
    const rental = (await connection.query("SELECT * FROM rentals WHERE id=$1", [rentalId])).rows[0]

    if(!rental.id){
        return res.sendStatus(404)
    }

    if(rental.returnDate !== null){
        return res.sendStatus(400)
    }

    const delayFee = 0
    const returnDate = dayjs().format('YYYY-MM-DD')
    const delayDays = (Math.floor(((dayjs().unix() - dayjs(rental.rentDate).unix())/86400)))


    if( delayDays > rental.daysRented){
        delayFee = rental.delayFee*(delayDays-daysRented)
    }
    console.log(delayFee)

    try{
        
        await connection.query(`UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`, [returnDate, delayFee, rentalId])
        res.sendStatus(200)

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
}

export async function deleteRent (req, res) {


    const rentalId = req.params.id
    const rental = await connection.query("SELECT * FROM rentals WHERE id = $1", [rentalId])

    if(rental.rowCount === 0){
        return res.sendStatus(404)
    }

    if(rental.rows[0].returnDate !== null){
        return res.sendStatus(400)
    }

    try {
        await connection.query("DELETE FROM rentals WHERE id=$1", [rentalId])
    } catch (err) {
        res.sendStatus(500)
    }
}