import { Router } from "express";
import { deleteRent, getMetrics, getRentals, rentGame, returnGame } from "../controllers/rentalsController.js";


const rentalRoute = Router()

rentalRoute.post("/rentals", rentGame)
rentalRoute.get("/rentals", getRentals)
rentalRoute.post("/rentals/:id/return", returnGame)
rentalRoute.delete("/rentals/:id", deleteRent)
rentalRoute.get("/rentals/metrics", getMetrics)


export default rentalRoute