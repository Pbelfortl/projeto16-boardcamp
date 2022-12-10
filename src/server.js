import experess from 'express'
import cors from 'cors'



const app = experess()

app.use(experess.json())
app.use(cors())

app.listen(4000, () => console.log("rodando na porta 4000"))