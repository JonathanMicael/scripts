// Libs
import { Router } from 'express'
import slugify from 'slugify'

// Models
import { Category } from '../models'

// Middlewares
import { adminAuth } from '../middlewares'

const router = Router()

router.get('/admin/categories/new', adminAuth, (req, res) => {
  res.render('admin/categories/new')
})

router.post('/categories/save', adminAuth, (req, res) => {
  const { title } = req.body
  if (title) {
    Category.create({
      title,
      slug: slugify(title)
    }).then(() => {
      res.redirect('/admin/categories')
    })
  } else {
    res.redirect('admin/categories/new')
  }
})

//criando a rota para listar as categorias
router.get('/admin/categories', adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index', { categories })
  })
})

//criando a rota para exclusão
router.post('/categories/delete', adminAuth, (req, res) => {
  const { id } = req.body
  if (id) {
    if (!isNaN(id)) {
      Category.destroy({
        where: {
          id
        }
      }).then(() => {
        res.redirect('/admin/categories')
      })
    } else {
      res.redirect('/admin/categories')
    }
  } else {
    res.redirect('/admin/categories')
  }
})

//criando a rota para edição
router.get('/admin/categories/edit/:id', (req, res) => {
  const { id } = req.params

  if (isNaN(id)) res.redirect('/admin/categories')

  Category.findByPk(id)
    .then(category => {
      if (category) {
        res.render('admin/categories/edit', { category })
      } else {
        res.redirect('/admin/categories')
      }
    })
    .catch(err => {
      console.log(err)
      res.redirect('/admin/categories')
    })
})

//criando a rota para update
router.post('/categories/update', adminAuth, (req, res) => {
  const { id, title } = req.body
  Category.update(
    { title, slug: slugify(title) },
    {
      where: {
        id
      }
    }
  )
    .then(() => {
      res.redirect('/admin/categories')
    })
    .catch(err => {
      console.log(err)
      res.redirect('/admin/categories')
    })
})

export default router
