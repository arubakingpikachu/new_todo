const express=require('express')
const exphbs = require('express-handlebars')
const Todo=require('./models/todo')
const mongoose = require('mongoose')
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

app.get('/', (req, res) => {
  Todo.find()
  .lean()
  .then(todos=>res.render('index',{todos:todos}))
  .catch(error=> console.error(error)) 
})

app.get('/todos/new', (req, res) => {
  return res.render('new')
})//new的頁面

app.post('/todos',(req,res)=>{
  const name = req.body.name       // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})//新增

app.get('/todos/:id',(req,res)=>{
  const id=req.params.id
  return Todo.findById(id)
  .lean()
  .then((todo)=>res.render('detail',{todo:todo}))
  .catch(error => console.log(error))
})//瀏覽詳細頁面

app.get('/todos/:id/edit',(req,res)=>{
  const id=req.params.id
  return Todo.findById(id)
  .lean()
  .then((todo)=>res.render('edit',{todo:todo}))
  .catch(error => console.log(error))
})//編輯條目頁面

app.put('/todos/:id',(req,res)=>{
  const id=req.params.id
  const name=req.body.name
  return Todo.findById(id)
  .then((todo)=>{
    todo.name=name
    return todo.save()
  })
  .then(()=>{
    res.redirect(`/todos/${id}`)
  })
  .catch(error => console.log(error))
})

app.delete('/todos/:id',(req,res)=>{
  const id=req.params.id
  return Todo.findById(id)
  .then((todo)=>todo.remove())
  .then(()=>res.redirect('/'))
  .catch(error => console.log(error))
})

app.listen(3000,()=>{
  console.log('App is running on http://localhost:3000')
})