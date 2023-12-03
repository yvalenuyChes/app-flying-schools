
const express = require('express')
const bodyParser = require('body-parser')
const { default: mongoose } = require('mongoose')
const cors = require('cors')

const PORT = process.env.PORT || 8000
const urLDB = "mongodb+srv://yvalenuyches:vIGGe3WeVIhS1fns@cluster0.5egxqpd.mongodb.net/?retryWrites=true&w=majority"

mongoose
   .connect(urLDB, {
      useNEWUrlParser: true,
      useUnifiedTopology: true,
   })
   .then(() => {
      console.log('database connected');
   })
   .catch(err => {
      console.log(err)
   })

const server = express()
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cors())

const CompanySchema = require('./server/schoolSchema.cjs')

server.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*")
   res.setHeader(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, cookie",
   )
   res.setHeader(
     "Access-Control-Allow-Methods",
     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
   )
   next()
 })

 server.get('/get_companies', (req,res) => {

   CompanySchema.find({})
      .then((result, err) => {
         if(result){
            res.status(200).send(result)
         }else{
            res.status(500).send(err)
         }
        
      })
      .catch(err => {
         res.status(500).send(err)
      })
 })


 server.get('/check_user', (req,res) => {
   console.log(req.data)
   CompanySchema.findOne({schoolName: req.data.schoolName})
   .then(result => {
    
      if(result.users){
         result.users.map(user => {
            if( user.timeFrom == req.data.timeFrom && user.date == req.data.date){
               res.status(400).send({message:'Время занято', color:'red'})
            } 
         })
      }else{
         res.status(404).send('Invalid schema')
      }
   })

   .catch(err => {
      console.log(err)
   })
 })


 server.post('/add_user', (req,res) => {
   const user = {
      name:req.data.name,
      surname:req.data.surname,
      timeFrom: req.data.timeFrom,
      timeTo:req.data.timeTo,
      date:req.data.date,
      serviceType: req.data.serviceType
   }
   try{
      CompanySchema
      .findOneAndUpdate(
         {schoolName:req.data.schoolName},
         {$push:{users:user}},
         {upsert:true}
      )
      .then(() => {
         res.status(200).send({message:'Пользователь добавлен', color:'lime'})
      })

      .catch(err => {
         console.log(err)
      })
   }catch(err){
      res.status(500).send({message:'User not saved', error:err})
   }
  
 })


 server.get('/get_company_by_name/', (req,res) => {
   //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   CompanySchema.findOne({schoolName :'CompanyOne'})
   .then((result,err) => {
     
      if(result){
       return  res.status(200).send(result)
      }else{
        return res.status(500).send(err)
      }
     
   })
   .catch(err => {
      console.log(err)
   })
 })

server.listen(PORT, (err) => {
   if(err) throw err
   console.log(`> Ready on http://localhost:${PORT}`)
})