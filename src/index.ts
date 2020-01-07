import { scheduleJob } from 'node-schedule';

import {
    oneDaily, weatherReport
} from './fetch';
import {
    renderTemplate, sendMail, loadOptions, Options
} from './utils';

async function run(options: Options) {
    console.log('Start task, now is ' + (new Date()));
    try {
        const one = await oneDaily();
        const weather = await weatherReport(options.HeWeatherKey);
        const mailContent = renderTemplate('src/mail.pug', one, weather);
        sendMail(mailContent, options.SMTP, options.Mails);
    } catch(err) {
        console.log(err);
    }
}

export async function main() {
    run(loadOptions('config.yaml'));
    // console.log('Scheduling...')
    // scheduleJob('0 30 7 * * *', run);
}
