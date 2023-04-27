const express=require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const User=require('./models/user')
const routes=require('./routes')
const methodOverride = require('method-override') 
const usePassPort=require('./config/passport')
require('./config/mongoose')



const app =express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassPort(app)//要放在路由器前面!!!!!!!

app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.isAuthenticated()
  res.locals.user=req.user
  next()
})

app.use(routes)






app.listen(3000,()=>{
  console.log('App is running on http://localhost:3000')
})