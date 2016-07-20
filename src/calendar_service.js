var twil = require('./twilio_service');
var fs = require('fs');
var moment = require('moment');


function formatDate(d) {
    // this is the format expected by iCal
    // commented out to show you the failing test.
    return d.utc().format('YYYYMMDDTHHmmSS') + 'Z';
    //return d.format();
}

function makeID() {
    var text = moment().format() + "-";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

    for (var i = 0; i < 15; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function sendCalendar(options){
    return twil.sendAttachmentToPhone({
        phoneNumber: options.phoneNumber,
        plainText: options.plainText,
        attachment: generateCalendar(options.calData),//todo: undo. this is hardcoded later
        mimeType: "text/calendar"
    });
}

function generateCalendar(clientData){
	/* ex: {	
	 	 title: "Loan Payment Due",
		 summary: "Please make sure to make the mininmum payment by the due date",
		 startDate:	"2016-05-01",
		 loanLength: 3
		}	
	*/
    var icsString = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Santander Consumer//Payment Reminder//EN'
    ];

    // todo: clamp the start to some reasonable time for the event to start.
    var start = moment(clientData.startDate).startOf('day');
    var dueDate = formatDate(start);
    var endDate = formatDate(start.add(1, 'days'));

    icsString.push('X-WR-CALNAME:' + clientData.title);
    icsString.push('BEGIN:VEVENT');
    icsString.push('UID:' + makeID());
    icsString.push('DTSTART:' + dueDate);
    icsString.push('DTEND:' + endDate);
    icsString.push('SUMMARY:' + clientData.title);
    icsString.push('DESCRIPTION:' + clientData.summary);
    icsString.push('RRULE:FREQ=MONTHLY;COUNT=' + clientData.loanLength);
    icsString.push('END:VEVENT');
    icsString.push('END:VCALENDAR');

    return Promise.resolve(icsString.join('\n'));
}

module.exports = {
    "sendCalendar": sendCalendar,
    "generateCalendar": generateCalendar
};
