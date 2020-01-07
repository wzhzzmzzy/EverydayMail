import { scheduleJob } from 'node-schedule';

import {
    oneDaily, weatherReport
} from './fetch';
import {
    renderTemplate, sendMail, loadOptions, Options
} from './utils';

async function run() {
    console.log('Loading config.yaml...');
    const options = loadOptions('config.yaml');
    console.log('Start task, now is ' + (new Date()));
    try {
        const one = await oneDaily();
        const weather = await weatherReport(options.HeWeatherKey);
        const mailContent = renderTemplate('templates/mail.pug', one, weather);
        sendMail(mailContent, options.SMTP, options.Mails);
    } catch(err) {
        console.log(err);
    }
}

export async function main() {
    // run();
    console.log('Scheduling...')
    scheduleJob('0 30 7 * * *', run);
}
