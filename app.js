const express=require('express')
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const mongoose = require('mongoose')
const routes=require('./routes')
const methodOverride = require('method-override') 

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app =express()



mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)




app.listen(3000,()=>{
  console.log('App is running on http://localhost:3000')
})