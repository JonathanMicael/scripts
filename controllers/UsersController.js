// Libs
import { Router } from 'express'
import { genSaltSync, hashSync, compareSync } from 'bcryptjs'

// Models
import { User } from '../models'

const router = Router()

router.get('/admin/users', (req, res) => {
  User.findAll().then(users => {
    res.render('users/index', { users })
  })
})

router.get('/admin/users/create', (req, res) => {
  res.render('users/create')
})

router.post('/users/create', (req, res) => {
  const { email, password } = req.body

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      const salt = genSaltSync(10)
      const hash = hashSync(password, salt)

      User.create({
        email,
        password: hash
      })
        .then(() => {
          res.redirect('/')
        })
        .catch(err => {
          res.redirect('/')
        })
    } else {
      res.redirect('/admin/users/create')
    }
  })
})

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/authenticate', (req, res) => {
  const { email, password } = req.body

  User.findOne({ where: { email } }).then(user => {
    if (user) {
      const correct = compareSync(password, user.password)

      if (correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles')
      } else {
        res.redirect('/login')
      }
    } else {
      res.redirect('/login')
    }
  })
})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/')
})
export default router
