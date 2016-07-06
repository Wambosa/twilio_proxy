"use strict";
var twilio = require('twilio');

//note://My Account SID/Token/PhoneNumber from www.twilio.com/console
var accountSid = '';
var authToken = '';
var sendFrom = '';

module.exports = {
    configure: function(options){
        accountSid = options.sid;
        authToken = options.token;
        sendFrom = options.from || '9728611026';
        return this;
    },

    sendTextToPhone: function(args) {

        let plainText = args.plainText;
        let phoneNumber = args.phoneNumber;

        let report = {
            error: null,
            info: null
        };

        //todo: the client likely does not need to be recreated every send message. also lookup how to terminate session.
        let client = new twilio.RestClient(accountSid, authToken);

        return new Promise(function (resolve, reject) {
            
            client.messages.create({
                body: plainText,
                to: `+1${phoneNumber}`,
                from: `+1${sendFrom}`
            }, function(err, message){
                report.error = err;
                report.info = message;
                resolve(report);
            });
        });
    },
    
    sendAttachmentToPhone: function(options){
        
        let phoneNumber = options.phoneNumber;
        let plainText = options.plainText;
        let attachment = options.attachment;
        let mimeType = options.mimeType;
        
        let report = {
            error: null,
            info: null
        };
        
        //todo: the client likely does not need to be recreated every send message. also lookup how to terminate session.
        let client = new twilio.RestClient(accountSid, authToken);
        
        return new Promise(function(resolve,reject){
            client.messages.create({
                body: plainText,
                to: `+1${phoneNumber}`,
                from: `+1${sendFrom}`,
                media_url: attachment
            }, function(err,message){
                report.error = err;
                report.info = message;
                resolve(report);
            });
        });
    }
};