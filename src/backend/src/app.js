require('dotenv').config()
const express = require('express')

const judge = require('./routes/judge')

const app = express()
const PORT = process.env.PORT

app.use(express.json()) //http://expressjs.com/en/api.html#express.json
app.use(express.urlencoded({ extended: false })) //http://expressjs.com/en/5x/api.html#express.urlencoded

app.use('/judge', judge)

app.listen(PORT, () => {
  console.info(`App listening on port ${PORT}`)
})
