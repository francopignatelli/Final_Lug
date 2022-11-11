import { Request, Response } from "express"
import item from "../models/item"
import ItemModel from "../models/item"  //Importacion del modelo

export default {
    getItems: async (req: Request, res: Response) => {
        try {
            const model = await ItemModel.find({})
        res.status(200).send(model)
        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al mostrar los item: ${error}`)
        }
    },
    
    createItem: async (req: Request, res: Response) => {
        try {
            const {name, price, amount} = req.body    // {} -> Extraigo lo que me importa del body
            const item = new ItemModel()
            item.name = name
            item.price = price
            item.amount = amount
            await item.save()
        res.send("El item se ha creado exitosamente.")
        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al crear un item: ${error}`)
        }
    },

    modItem: async (req: Request, res: Response) => {
        try {
            const { itemId } = req.params
            if (!itemId) {
                res.status(400).send("El itemId ingresado es inválido")
                return
            }
            const item = await ItemModel.findById(itemId)

            if (!item) {
                res.status(404).send('itemId no encontrado.')
                return
            }

            const {name, price, amount} = req.body
            item.name = name
            item.price = price
            item.amount = amount
            await item.save()
            res.status(200).send("El item se modifico correctamente.")           
        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al modificar un item: ${error}`)
        }
    },

    delItem: async (req: Request, res: Response) => {
        try {
            const { itemId } = req.params
            if (!itemId) {
                res.status(400).send("El itemId ingresado es inválido")
                return
            }
            const item = await ItemModel.findById(itemId)

            if (!item) {
                res.status(404).send('itemId no encontrado.')
                return
            }

            await item.delete()
            res.status(200).send("El item se eliminó correctamente.")           
        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al eliminar un item: ${error}`)
        }
    },    
}