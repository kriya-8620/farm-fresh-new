
/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    name: String,
    price: Number,
    quantity: {
        type: Number,
        default: 1
    }
});

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
    items: [cartItemSchema]
});

const Cart= mongoose.model('Cart', cartSchema);
module.exports=Cart;*/