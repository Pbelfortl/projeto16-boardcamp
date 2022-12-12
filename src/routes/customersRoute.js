import { Router } from "express";
import { getCustomers, insertCustomer, updateCustomer } from "../controllers/customersController.js";


const customersRoute = Router()

customersRoute.post("/customers", insertCustomer)
customersRoute.get("/customers", getCustomers)
customersRoute.put("/customers/:id", updateCustomer)

export default customersRoute