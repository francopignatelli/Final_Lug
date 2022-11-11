import express, {Express, Request, Response} from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import apiRouter from './routes/api'    //Importacion del Router
import load_dotenv from "dotenv"
dotenv.config()


const app: Express = express()
const port = 3000


app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true}))

app.use('/api', apiRouter)

//Abrir servidor
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

openConnectionDB().then(() => {
    console.log("Conexión exitosa.")
}).catch((err) => {
  console.log(`Se encontro un problema al conectarse a la base de datos: ${err}`)  
})

//Se conecta con la base de datos
async function openConnectionDB() {
    //Checkeo si el string de conexion a la DB es correcta
    if (process.env.MONGOOSE_CONNECTION_STRING) {
        await mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
    } else {
        console.log("No existe string de conexión.")
    }
}