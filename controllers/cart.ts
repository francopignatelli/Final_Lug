import { Request, Response } from "express"
import { ObjectId, Types } from "mongoose"
import CartModel from "../models/cart"  //Importacion del modelo
import ItemModel from "../models/item"

interface Item{
    item: Types.ObjectId,
    amount: number
}

export default {
    getCarts: async (req: Request, res: Response) => {
        try {
            const model = await CartModel.find({})
            res.status(200).send(model)
        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al mostrar los carritos: ${error}`)
        }
    },
    
    createCart: async (req: Request, res: Response) => {
        const {items} = req.body    // {} -> Extraigo lo que me importa del body
        const cart = new CartModel()
        cart.total = 0
        
        for (let index = 0; index < items.length; index++) {
            const cartItem = items[index];
            const item = await ItemModel.findById(cartItem.item)
            if (!item) {
                await cart.save()
                res.send("El carrito se ha creado exitosamente.")
                return
            }
            cart.total += item.price * cartItem.amount
        }
        await cart.save()
        res.send("El carrito se ha creado exitosamente.")
    },

    addItemtoCart: async (req: Request, res: Response) => {
        //Req: recibo el carrito que quiero modificar y los item que quiero agregar.
        try {
            const {cartId} = req.params
            const cart = await CartModel.findById(cartId)
            const {items}:{items:Item[]} = req.body    //Aray de item (Inteface)

            if (!cart) {
                res.status(400).send("El carrito ingresado es inválido.")
                return
            }

            //Checkeo stock
            //Recibo el ObjectId, busco el objeto y checkeo el amount del item con respecto a la cant que quiero agregar al carrito

            //iteracion items del req
            for (let i = 0; i < items.length; i++) {
                const item = items[i];  //item id del req.body
                const itemModel = await ItemModel.findById(item.item)   //item del req
                if (!itemModel) {
                    res.status(400).send("El item que se quiere añadir al carrito es inválido.")
                    return
                }
                
                //Checkear si el item ya existe en el carrito. Si es asi que no supere el stock, y sumarlo al item ya existente

                const itemIndex = cart.items.findIndex(x => x.item == item.item)    //Devuelve indice del item del carrito
                //Buscar si coincide el item
                if (itemIndex !== -1) {
                    //Checkea que el stock sea menor al stock del item
                    if (item.amount + cart.items[itemIndex].amount > itemModel.amount) {
                        res.status(400).send("El stock es insuficiente.")
                        return      
                    }
                    cart.items[itemIndex].amount += item.amount
                //Si el item no coincide
                } else {
                    if (item.amount > itemModel.amount) {
                        res.status(400).send("El stock es insuficiente.")
                        return 
                    }
                    cart.items.push(item)
                }
            } 

            //Calculo del total
            for (let i = 0; i < cart.items.length; i++) {
                const cartItem = cart.items[i];
                const item = await ItemModel.findById(cartItem.item)
                cart.total += item!.price * cartItem.amount     //! Propiedad no null
            }

            await cart.save()
            res.status(200).send("El item se ha añadido correctamente al carrito.")
        
        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al llenar el carrito: ${error}`)
        }
    },

    deleteItemfromCart: async (req: Request, res: Response) => {
        try {
            
            //Encontrar el item que se quiere eliminar
            //Eliminar el item del carrito
            //Guardar el carrito con el item eliminado

            //Encontrar el carrito del que se quiere eliminar el item
            const {cartId} = req.params
            const cart = await CartModel.findById(cartId)

            const {items}:{items:Item[]} = req.body

            //Checkeo si el carrito del params es valido
            if (!cart) {
                res.status(400).send("El carrito ingresado es inválido.")
                return
            }

            //Encontrar el item que se quiere eliminar
            for (let i = 0; i < items.length; i++) {
                const item = items[i]; //Item del req.body

                const cartItem = cart.items.find(x => x.item == item.item)   //Item del carrito

                if (cartItem) {
                    if (item.amount >= cartItem.amount) {
                        cart.items.splice(cart.items.indexOf(cartItem), 1)
                    } else {
                        cart.items[cart.items.indexOf(cartItem)].amount -= item.amount
                    }
                    
                } else {
                    res.status(400).send("El item/s que quiere eliminar no esta en el carrito")
                }
            }
            await cart.save()
            res.status(200).send("El item/s se han removido correctamente.")

        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al eliminar el item/s del carrito: ${error}`)
        }
    },


    delCart: async (req: Request, res: Response) => {
        try {
            const {cartId} = req.params
            const cart = CartModel.findById(cartId)

            if (!cart) {
                res.status(400).send("El carrito ingresado es inválido.")
                return
            }
            
            await CartModel.deleteOne(cart)
            res.status(200).send("El carrito se ha eliminado correctamente.")

        } catch (error) {
            console.log(error)
            res.status(500).send(`Ha ocurrido un error al eliminar el carrito: ${error}`)
        }
    },    
}