import {model, Schema, SchemaType} from "mongoose"

const cartSchema = new Schema({
    total: {type: Number, default: 0},
    items: [
        {
            item: {type: Schema.Types.ObjectId, ref: "item", require: true},
            amount: {type: Number, require: true, default: 0}  
        }
    ]
})

export default model('cart', cartSchema)
//Trasfroma el Schema en algo con lo que podemos trabajar en el codigo
