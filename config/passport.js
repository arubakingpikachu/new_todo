const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User=require('../models/user')
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy



module.exports=app=>{

  app.use(passport.initialize());// is a middle-ware that初始化Passport
  app.use(passport.session())//that alters the request object and change the 'user' value that is currently the session id (from the client cookie) into the true deserialized user object.

  passport.use(new LocalStrategy ({ usernameField: 'email' },(email, password, done) =>{
    User.findOne({email})
    .then(user=>{
      if (!user) { return done(null, false, { message: 'That email is not registered!' })}
      return bcrypt.compare(password,user.password)//前參數=使用者的輸入值;後參數=資料庫裡的雜湊值
      .then(isMatch=>
        {if(!isMatch) {
        return done(null, false, { message: 'Email or Password incorrect.' })}
        return done(null, user)})//isMatch為bcrypt.compare回傳的布林值
    })
    .catch(err => done(err, false))
   
    } 
    
  ))

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields:['email','displayName'], //取得使用者資料的哪些欄位,並回傳至 callback 的 profile 參數
  },
  (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))})

  
  
}


