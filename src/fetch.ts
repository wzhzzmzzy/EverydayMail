import axios from 'axios';
import cheerio = require('cheerio');

export interface ONEToday {
    oneDailyUrl: string,
    onePictureUrl: string,
    onePictureContent: string,
    oneArticleUrl: string,
    oneArticleTitle: string,
}

export interface Weather {
    location: string,
    dayCondition: string,
    nightCondition: string,
    sunRise: string,
    sunSet: string,
    tmpMin: number,
    tmpMax: number,
    windDeg: number,
    windDir: string,
    windSc: string,
    hum: number,        // 相对湿度
    pop: number,        // 降水概率
    uvIndex: number,    // 紫外线
    aqi: number,        // 空气质量指数
    qlty: string,       // 空气质量
}

/**
 * @description 返回 ONE 的今日更新
 */
export async function oneDaily(): Promise<ONEToday> {
    const oneDailyUrl = 'http://m.wufazhuce.com/one';
    const oneDesktopUrl = 'http://wufazhuce.com/';
    const $ = cheerio.load((await axios.get(oneDesktopUrl)).data);
    const oneArticleUrl = $('.one-articulo-titulo a').attr('href');
    const oneArticleTitle = $('.one-articulo-titulo a').text().replace(/\s/g, '');
    const onePicture = $($('.item')[0]);
    const onePictureUrl = onePicture.find('.fp-one-imagen').attr('src');
    const onePictureContent = onePicture.find('.fp-one-cita a').text();
    
    return {
        oneDailyUrl,
        onePictureUrl,
        onePictureContent,
        oneArticleUrl,
        oneArticleTitle
    }
}

/**
 * @description 天气预报，使用和风天气 API 数据
 * @param key
 * @param location
 */
export async function weatherReport(
        key: string, location: string = 'jiangyin,wuxi'
    ): Promise<Weather>  {
    const heweatherUrl = 'https://free-api.heweather.net/s6/';
    const forecastData = (await axios.get(heweatherUrl + 'weather/forecast', {
        params: {
            location,
            key,
        }
    })).data.HeWeather6[0];
    const weatherData = forecastData['daily_forecast'][0];
    const airData = (await axios.get(heweatherUrl + 'air/now', {
        params: {
            location,
            key,
        }
    })).data.HeWeather6[0]['air_now_city'];
    return {
        location: forecastData.basic.location,
        dayCondition: weatherData['cond_txt_d'],
        nightCondition: weatherData['cond_txt_n'],
        hum: parseInt(weatherData['hum']),
        pop: parseInt(weatherData['pop']),
        sunRise: weatherData['sr'],
        sunSet: weatherData['ss'],
        windDeg: parseInt(weatherData['wind_deg']),
        windDir: weatherData['wind_dir'],
        windSc: weatherData['wind_sc'],
        tmpMax: parseInt(weatherData['tmp_max']),
        tmpMin: parseInt(weatherData['tmp_min']),
        uvIndex: parseInt(weatherData['uv_index']),
        aqi: parseInt(airData.aqi),
        qlty: airData.qlty,
    };
}