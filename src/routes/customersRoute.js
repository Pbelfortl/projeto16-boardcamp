import { Router } from "express";
import { getCustomers, insertCustomer, updateCustomer, getCustomerById } from "../controllers/customersController.js";


const customersRoute = Router()

customersRoute.post("/customers", insertCustomer)
customersRoute.get("/customers", getCustomers)
customersRoute.get("/customers/:id", getCustomerById)
customersRoute.put("/customers/:id", updateCustomer)

export default customersRoute