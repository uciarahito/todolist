var CronJob = require('cron').CronJob,
    kue = require('kue'),
    queue = kue.createQueue(),
    methods = {},
    AWS = require('aws-sdk');
require('dotenv').config();

methods.sendSMS = function(data) {
    console.log(data);
    // let parseDueDate = moment(data.due_date).format('dddd, D MMM YYYY, h:mm')
    // let parseDueDate = moment(data.due_date).format('ss mm h DD MM e')
    let date = new Date(data.due_date)
    let s = date.getMinutes()
    let h = date.getHours()
    let d = date.getDate()
    let m = date.getMonth()
    let e = date.getDay()
    // console.log('masuk ke helper sendSMS');
    // console.log(parseDueDate);
    // console.log('tutupnya');
    new CronJob(`00 ${s} ${h} ${d} ${m} ${e}`, function() {
        var job = queue.create('sms', {
            message: 'Selamat hari selasa!',
            name: data.username,
            phone: data.phone
        }).save(function(err) {
            if (!err) console.log(job.id);
            console.log('You will see this message every second');
        });

        queue.process('sms', function(job, done) {
            // console.log(job);
            var params = {
                Message: `Hi ${job.data.name}, ${job.data.message}`,
                PhoneNumber: job.data.phone
            };
            // console.log(params);
            sendMessage(params);
            done()
        });

    }, null, true, 'Asia/Jakarta');

    function sendMessage(params) {
        AWS.config.update({
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET,
            region: process.env.SNS_REGION
        });

        var sns = new AWS.SNS();

        console.log(params);
        sns.publish(params, function(err, data) {
            console.log('------- Masukk');
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data); // successful response
        });
    }
}

module.exports = methods