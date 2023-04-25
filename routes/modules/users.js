const express=require('express')
const router=express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})//燈入夜面

router.post('/login',(req,res)=>{
})
router.get('/register',(req,res)=>{
  res.render('register')
})

module.exports = router