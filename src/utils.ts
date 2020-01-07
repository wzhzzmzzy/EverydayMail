import { compileFile } from 'pug';
import { readFileSync } from 'fs';
import { safeLoad } from 'js-yaml';
import { createTransport } from 'nodemailer';
import { ONEToday, Weather } from './fetch';

export interface Options {
    HeWeatherKey: string,
    SMTP: SMTPOptions,
    Mails: Envelope[],
}

interface SMTPOptions {
    host: string,
    port: number,
    secure: boolean,
    auth: {
        user: string,
        pass: string,
    }
}

interface Envelope {
    from: string,
    to: string
}

/**
 * @description 读取配置文件
 * @param config 
 */
export function loadOptions(path: string): Options {
    const config = safeLoad(readFileSync(path, {
        encoding: 'utf-8'
    }));
    return config;
}

export function getWeekday(day: number): string {
    switch(day) {
        case 1: return '星期一';
        case 2: return '星期二';
        case 3: return '星期三';
        case 4: return '星期四';
        case 5: return '星期五';
        case 6: return '星期六';
        case 7: return '星期日';
    }
}

export function renderTemplate(template: string, one: ONEToday, weather: Weather) {
    const now: Date = new Date();
    return compileFile(template)({
        title: '测试邮件',
        onePictureUrl: one.onePictureUrl,
        onePictureContent: one.onePictureContent,
        dayCondition: weather.dayCondition,
        nightCondition: weather.nightCondition,
        tmpMin: weather.tmpMin,
        tmpMax: weather.tmpMax,
        aqi: weather.aqi,
        qlty: weather.qlty,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        weekday: getWeekday(now.getDay()),
    });
}

export function sendMail(mailContent: string, smtpOptions: SMTPOptions, mails: Envelope[]) {
    const trans = createTransport(smtpOptions);
    for (const mail of mails) {
        const sendOptions = {
            ...mail,
            html: mailContent,
        };
        trans.sendMail(sendOptions);
    }
    
    
}