import { Router } from "express";
import { getGames, insertGame } from "../controllers/gamesController.js";

const gamesRoute = Router()

gamesRoute.post("/games", insertGame)
gamesRoute.get("/games", getGames)

export default gamesRoute