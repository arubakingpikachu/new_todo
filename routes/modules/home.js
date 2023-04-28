const express = require('express')
const router = express.Router()

const Todo = require('../../models/todo')



router.get('/', (req, res) => {
  const userId = req.user._id//登入者的id
  Todo.find({userId})//找出登入者的id
  .lean()
  .sort({ _id: 'asc' })
  .then(todos=>res.render('index',{todos:todos}))
  .catch(error=> console.error(error)) 
})

module.exports = router