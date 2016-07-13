var twil = require('./twilio_service');
var fs = require('fs');

function sendCalendar(options){
    return twil.sendAttachmentToPhone({
        phoneNumber: options.phoneNumber,
        plainText: options.plainText,
        attachment: null,//todo: undo. this is hardcoded later
        mimeType: "text/calendar"
    });
}

function generateCalendar(){
    return Promise.resolve(
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Santander Consumer//Payment Reminder//EN
X-WR-CALNAME:Loan Payment Due
BEGIN:VEVENT
UID:2016-07-13T15:50:52-05:00-%eE$!CA4N&CLtoo
DTSTART:20160501T050000Z
DTEND:20160502T050000Z
SUMMARY:Loan Payment Due
DESCRIPTION:Please make sure to make the mininmum payment by the due date.
RRULE:FREQ=MONTHLY;COUNT=3
END:VEVENT
END:VCALENDAR
`);
}

module.exports = {
    "sendCalendar": sendCalendar,
    "generateCalendar": generateCalendar
};
