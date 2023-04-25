const express=require('express')
const User=require('../../models/user')// 引入User model

const router=express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})//燈入夜面

router.post('/login',(req,res)=>{
})
router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/register',(req,res)=>{
  const{name,email,password,confirmPassword}=req.body

  User.findOne({email:email})
  .then((user=>{
    if(user){
      console.log('User already exists.')
      res.render('register',{
        name,
        email,
        password,
        confirmPassword
      })
    }else{
      return User.create({
        name,
        email,
        password
      })
      .then(()=>res.redirect('/'))
      .catch(error => console.log(error))
    }
  }))
  .catch(error => console.log(error))
})//註冊帳號

module.exports = router