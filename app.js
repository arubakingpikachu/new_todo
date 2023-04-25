const express=require('express')
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const User=require('./models/user')
const routes=require('./routes')
const methodOverride = require('method-override') 
require('./config/mongoose')



const app =express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)




app.listen(3000,()=>{
  console.log('App is running on http://localhost:3000')
})