import {model, Schema, Types} from "mongoose"

interface IPopulatedItem{
    item: {
        name: String,
        price: number,
        amount: number
    },
    amount: number                 
}

interface IItem{
    item: Types.ObjectId,
    amount: number
}

const cartSchema = new Schema({
    total: {type: Number, default: 0},
    items: [
        {
            item: {type: Schema.Types.ObjectId, ref: "item", require: true},
            amount: {type: Number, require: true, default: 0}  
        }
    ]
})
const CartModel = model('cart', cartSchema)


export { CartModel, IPopulatedItem, IItem }
//Trasfroma el Schema en algo con lo que podemos trabajar en el codigo
