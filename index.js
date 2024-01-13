const functions = require("firebase-functions");
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const dontenv = require('dotenv')

const User = require('./models/User.jsx')
const News = require('./models/noticia.jsx')
const Product = require('./models/produto.jsx')
const Event = require('./models/evento.jsx')

dontenv.config()

const app = express() 

const corsOptions = {
  origin: 'https://neofranxxservices.web.app', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions))
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send('Bem-vindo à API');
});

app.post("/auth/cadaster", async (req, res) => {
  try {
      const { userName, email, password } = req.body;

      // criptografa a senha
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      //verifica se o usuário já existe
      const userExists = await User.findOne({ email: email})

      if(userExists) {
        console.log('usuario ja logado nessa conta')
        return res.status(422).json({msg: 'usuario ja logado nessa conta'})
      }

      const newUser = new User({
        userName,
        email,
        password: passwordHash,
        fullName: '',
        age: 0,
        access: '',
        position: '',
        linkedin: '',
        github: '',
        gender: '',
        nationality: '',
        address: '',
        hiringDate: null,
        maritalStatus: false,
        status: '',
        storeLocation: '',
      });

      const resUser = await newUser.save();

      res.status(201).json({ mensagem: 'Usuário criado com sucesso', user: resUser });
  } catch (error) {
    console.error('Erro ao criar o usuário:', error);
    res.status(500).json({ erro: 'Erro interno ao processar a solicitação' });
  }
});

app.get("/users", async (req, res) => {

  try {
    const users = await User.find({});
    res.json(users)

  } catch {
    res.status(500).json({erro: 'erro ao obter dado dos usuários'})
  }
});

app.post("/news", async (req, res) => {
  try {
      const { title, img, auth, description, date } = req.body;

      const newNews = new News ({
        title,
        img,
        auth,
        description,
        date,
      });

      const resNews = await newNews.save();

      res.status(201).json({ mensagem: 'Notícia criado com sucesso', news: resNews });
  } catch (error) {
      console.error('Erro ao criar a notícia:', error);
      res.status(500).json({ erro: 'Erro interno ao processar a solicitação' });
  }
});

app.get("/news", async (req, res) => {

  try {
    const news = await News.find({});
    res.json(news)

  } catch {
    res.status(500).json({erro: 'erro ao obter dado das notícias'})
  }
});

app.post("/products", async (req, res) => {
  try {
      const { name, cod, img, price, description, category, inEstoque, NumEstoque } = req.body;

      const newProduct = new Product({
        name,
        cod,
        img,
        price,
        description,
        category,
        inEstoque,
        NumEstoque
      });

      const resProduct = await newProduct.save();

      res.status(201).json({ mensagem: 'Produto criado com sucesso', product: resProduct });
  } catch (error) {
      console.error('Erro ao criar o produto:', error);
      res.status(500).json({ erro: 'Erro interno ao processar a solicitação' });
  }
});

app.get("/products", async (req, res) => {

  try {
    const products = await Product.find({});
    res.json(products)

  } catch {
    res.status(500).json({erro: 'erro ao obter dado dos produtos'})
  }
});

app.post("/events", async (req, res) => {
  try {
      const { nameEvent, typeEvent, description, dateEvent, HourEvent } = req.body;

      const newEvent = new Event({
        nameEvent,
        typeEvent,
        description,
        dateEvent,
        HourEvent,
      });

      const resEvent = await newEvent.save();

      res.status(201).json({ mensagem: 'evento criado com sucesso', event: resEvent });
  } catch (error) {
      console.error('Erro ao criar o evento:', error);
      res.status(500).json({ erro: 'Erro interno ao processar a solicitação' });
  }
});

app.get("/events", async (req, res) => {

  try {
    const events = await Event.find({});
    res.json(events)

  } catch {
    res.status(500).json({erro: 'erro ao obter dado dos eventos'})
  }
});

// Credenciais
const accessKey = process.env.USER;
const dbPassword = process.env.PASSWORD;
const dbName = process.env.DBNAME;
const PORT = process.env.PORT || 3000

mongoose.connect(`mongodb+srv://${accessKey}:${dbPassword}@neofranxx.pgwzccy.mongodb.net/${dbName}?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Conectado ao MongoDB')
    app.listen(PORT, () => {
        console.log(`API conectada na ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error)
  });