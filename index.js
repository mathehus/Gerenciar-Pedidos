require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const SECRET_KEY = process.env.SECRET_KEY;
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());



mongoose.connect('mongodb://localhost:27017/ordersDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado MongoDB'))
  .catch(err => console.log(err));


//Criando modelo 
const OrderSchema = new mongoose.Schema({
    customer: String,
    items: [{ product: String, quantity: Number, price: Number }],
    total: Number,
    status: { type: String, enum: ['Pendente', 'Processado'], default: 'Pendente' },
    createdAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Order = mongoose.model('Order', OrderSchema);
const User = mongoose.model('User', UserSchema);

const authenticateToken = (req, res, next) => {
    let token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Acesso negado' });
    if(token.includes('Bearer ')){ token = token.split(' ')[1];};
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};


app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hasedSenha = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hasedSenha });
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Rotas da API
app.post('/orders', authenticateToken, async (req, res) => {
    const { customer, items } = req.body;
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const newOrder = new Order({ customer, items, total });
    await newOrder.save();
    res.status(201).json(newOrder);
});

app.get('/orders', authenticateToken, async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

app.put('/orders/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
});



// Iniciar o servidor
app.listen(PORT, () => console.log(`RODANDO ${PORT}`));