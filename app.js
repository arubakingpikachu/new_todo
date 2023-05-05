const express=require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const User=require('./models/user')
const routes=require('./routes')
const methodOverride = require('method-override') 
const usePassPort=require('./config/passport')
const flash=require('connect-flash')
const PORT = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')



const app =express()

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

usePassPort(app)//要放在路由器前面!!!!!!!
app.use(flash())
app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.isAuthenticated()
  res.locals.user=req.user
  res.locals.success_msg = req.flash('success_msg')//設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')//設定 warning_msg 訊息
  next()
})

app.use(routes)






app.listen(3000,()=>{
  console.log(`App is running on http://localhost:${PORT}`)
})