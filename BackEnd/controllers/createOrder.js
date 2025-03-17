const mongoose = require('mongoose');

//Criando modelo 
const OrderSchema = new mongoose.Schema({
    customer: String,
    items: [{ product: String, quantity: Number, price: Number }],
    total: Number,
    status: { type: String, enum: ['Pendente', 'Processado'], default: 'Pendente' },
    createdAt: { type: Date, default: Date.now }
});


const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order };
