const {Schema, model} = require('mongoose')

const CompanySchema = new Schema({
  schoolName:String,
  workTime:Array,
  users:[{
      name:String,
      surname:String,
      date:String,
      serviceType:String,
      timeFrom:String,
      timeTo:String
  }]
}, 
{ timestamp: true },
)

module.exports = model('Company', CompanySchema)