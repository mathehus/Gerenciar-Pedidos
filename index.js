require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { router } = require('./routes');
const cors = require('cors');
const app = express();


const PORT = process.env.PORT;
const URL_MONGODB = process.env.URL_MONGODB;

app.use(express.json());
app.use(cors());
app.use(router);


mongoose.connect(URL_MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado MongoDB'))
  .catch(err => console.log(err));


// Iniciar o servidor
app.listen(PORT, () => console.log(`RODANDO ${PORT}`));