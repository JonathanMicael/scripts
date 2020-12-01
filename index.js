import express from 'express'
import { urlencoded, json } from 'body-parser'
import session from 'express-session'
import dotenv from 'dotenv'

// Configs
import connection from './configs/database'
dotenv.config()

// Controllers
import categoriesController from'./controllers/CategoriesController'
import articlesController from'./controllers/ArticlesController'
import usersController from'./controllers/UsersController'

// Models
import { Category, Article } from './models'

// App
const app = express()

app.set('view engine', 'ejs')

app.use(
  session({
    secret: process.env.APP_SECRET,
    cookie: { maxAge: 300000 }
  })
)

app.use(
  urlencoded({
    extended: false
  })
)

app.use(json())

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com sucesso!')
  })
  .catch(err => {
    console.log(err)
  })

app.use(express.static('public'))

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.listen(process.env.APP_PORT, () => {
  console.log('Iniciou')
})

app.get('/', (req, res) => {
  Article.findAll({
    order: [['id', 'DESC']],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', { articles: articles, categories: categories })
    })
  })
})

app.get('/:slug', (req, res) => {
  const { slug } = req.params

  Article.findOne({
    where: {
      slug
    }
  })
    .then(article => {
      if (article) {
        Category.findAll().then(categories => {
          res.render('partials/article', {
            article,
            categories
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
})

app.get('/category/:slug', (req, res) => {
  const { slug } = req.params

  Category.findOne({
    where: {
      slug
    },
    include: [{ model: Article }]
  })
    .then(({ articles }) => {
      if (articles) {
        Category.findAll().then(categories => {
          res.render('index', {
            articles,
            categories
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
})
