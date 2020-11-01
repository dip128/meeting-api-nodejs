const Appointment = require('../model/article');

const notifications = function() {
  return {
    run: function() {
      Appointment.sendNotifications();
     
    },
  };
};

module.exports = notifications();