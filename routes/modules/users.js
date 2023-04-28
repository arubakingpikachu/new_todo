const express=require('express')
const User=require('../../models/user')// 引入User model
const passport = require('passport')//引入passport

const router=express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})//燈入夜面

router.post('/login',passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))//登入機制

router.get('/register',(req,res)=>{
  res.render('register')
})//註冊畫面

router.post('/register',(req,res)=>{
  const{name,email,password,confirmPassword}=req.body
  const errors=[]//登入頁的錯誤訊息，設計成陣列，依照不同情況顯示訊息

  if (!name||!email||!password||!confirmPassword){
    errors.push({message: '所有欄位都是必填。'})
  }//若其中一項不存在，在error陣列推入錯誤訊息
  if (password!==confirmPassword){
    errors.push({message:'密碼與確認密碼不相符！'})
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email }).then(user => {
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
})//註冊帳號機制

router.get('/logout',(req,res)=>{
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router