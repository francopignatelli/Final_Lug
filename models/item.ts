import {model, Schema} from "mongoose"

const itemSchema = new Schema({
    name: String,
    price: {type: Number, default: 0},
    amount: {type: Number, require: true, default:0}
})

export default model('item', itemSchema)
