const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const moment = require('moment');
const dompurify = createDomPurify(new JSDOM().window)
const nodemailer = require('nodemailer')
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String
  },
  meetingtime:{
    type:Date,
    required:true
  },
   notification: {
    type: Number,
    default:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }

  next()
})
articleSchema.methods.requiresNotification = function(date) {
  return Math.round(moment.duration(moment(this.meetingtime).utc()
                          .diff(moment(date).utc())
                          ).asMinutes()) === this.notification;
};
articleSchema.statics.sendNotifications = function(cb) {
  const searchDate = new Date();
  console.log('searchDate : ' + searchDate);
  Article
    .find()
    .then(function(Articles) {
      appointments = Articles.filter(function(Article){
        return Article.requiresNotification(searchDate);
      });
      if (appointments.length > 0) {
        console.log("I FOUND AN APPOINTMENT!!!");
        console.log(appointments);
        //sendNotifications(appointments);
      } else {
        console.log("duration");
        console.log(Math.round(moment.duration(moment(this.time).utc()
                          .diff(moment(searchDate).utc())
                          ).asMinutes()));
      }
    });
  }
  const transport= nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'',
      pass:''
    }
  });
    function sendNotifications(appointments) {
        appointments.forEach(function(appointment) {
        const message = {
          to: 'mailid_to',
          from: 'official mail_id',
          body: `Hi! Just a quick reminder that ${appointment.title} is coming up in ${appointment.markdown}!`,
        }
    });
    transport.sendMail(message, function(error,info){
      if(error){
        console.log(error)
      }
      else{
        console.log('Email sent'+info.response)
      }
    })
  }

const Article = mongoose.model('Article', articleSchema)
module.exports = Article