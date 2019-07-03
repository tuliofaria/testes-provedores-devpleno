const express = require('express')
const app = express()
const mysql = require('mysql2')
const fs = require('fs')

const port = process.env.PORT || 3000
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'testes_server',
  multipleStatements: true
})
connection.connect(err => {
  if (!err) {
    console.log('connected to db.')
  }
  connection.query(`show tables like 'contacts'`, (err, rows) => {
    if (rows.length === 0) {
      const sql = String(fs.readFileSync('./db.sql'))
      connection.query(sql, (err) => {
        if (!err) {
          console.log('database created.')
        }
      })
    }
  })
})

app.get('/', (req, res) => {
  res.send('Hello DevPleno!')
})
app.get('/contacts', (req, res) => {
  connection.query('select * from contacts', (err, rows) => {
    if (err) {
      res.send({
        error: 'error connecting to db'
      })
    } else {
      res.send(rows)
    }
  })
})
app.listen(port, err => {
  if (!err) {
    console.log('server listening on port', port)
  } else {
    console.log(err)
  }
})
