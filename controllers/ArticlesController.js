// Libs
import { Router } from 'express'
import slugify from 'slugify'

// Models
import { Category, Article } from '../models'

// Middlewares
import { adminAuth } from '../middlewares'

const router = Router()

router.get('/admin/articles', adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(articles => {
    res.render('admin/articles/index', { articles })
  })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/articles/new', { categories })
  })
})

router.post('/articles/save', adminAuth, (req, res) => {
  const { title, body, category } = req.body

  Article.create({
    title,
    slug: slugify(title),
    body,
    categoryId: category
  }).then(() => {
    res.redirect('/admin/articles')
  })
})

router.post('/articles/delete', adminAuth, (req, res) => {
  const { id } = req.body
  if (id) {
    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id
        }
      }).then(() => {
        res.redirect('/admin/articles')
      })
    } else {
      res.redirect('/admin/articles')
    }
  } else {
    res.redirect('/admin/articles')
  }
})

router.get('/admin/articles/edit/:id', adminAuth, (req, res) => {
  const { id } = req.params
  Article.findByPk(id)
    .then(article => {
      if (article) {
        Category.findAll().then(categories => {
          res.render('admin/articles/edit', {
            categories,
            article
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

router.post('/articles/update', adminAuth, (req, res) => {
  const { id, title, body, category } = req.body

  Article.update(
    { title, body, categoryId: category, slug: slugify(title) },
    {
      where: {
        id
      }
    }
  )
    .then(() => {
      res.redirect('/admin/articles')
    })
    .catch(err => {
      console.log(err)
      res.redirect('/')
    })
})

router.get('/articles/page/:num', (req, res) => {
  const { num: page } = req.params.num
  const offset = 0

  if (isNaN(page) || page === 1) offset = 0
  else offset = (parseInt(page) - 1) * 4

  Article.findAndCountAll({
    limit: 4,
    offset
  }).then(articles => {
    let next
    if (offset + 4 >= articles.count) next = false
    else next = true

    const result = {
      page: parseInt(page),
      next,
      articles
    }

    Category.findAll().then(categories => {
      res.render('admin/articles/page', {
        result,
        categories
      })
    })
  })
})

export default router
