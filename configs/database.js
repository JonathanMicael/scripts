import Sequelize from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const db_name = process.env.MYSQL_DATABASE
const db_username = process.env.MYSQL_USERNAME
const db_password = process.env.MYSQL_PASSWORD

const connection = new Sequelize(db_name, db_username, db_password, {
  host: process.env.MYSQL_HOST,
  dialect: process.env.MYSQL_CONNECTION || 'mysql',
  port: process.env.MYSQL_PORT,
  timezone: '-03:00'
})

export default connection
