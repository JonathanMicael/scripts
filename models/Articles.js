import Sequelize from 'sequelize'
import connection from '../configs/database'
import { Category } from './Category'

export const Article = connection.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Category.hasMany(Article)
Article.belongsTo(Category)

// Article.sync({ force: true })
// Category.sync({ force: true })
