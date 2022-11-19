import constants from './constants';

export function calculatePrice(lang: string, mimetype: string, count: number): number {
    let price = count
        * (lang === 'en' ? constants.price.priceEnglish : constants.price.priceCyrillic);

    const min = lang === 'en' ? constants.price.minEnglish : constants.price.minCyrillic;

    price = Math.max(price, min) * (constants.allowedMimetype.includes(mimetype) ? 1 : constants.otherMultiplier);

    return Math.round(price*100)/100;

}

export function calculateTime(lang: string, mimetype: string, count: number): number {
    const perHour = lang === 'en' ?
        constants.time.perHourEnglish :
        constants.time.perHourCyrillic;

    let time = 1800 + 3600 * (count / perHour);
    time = Math.max(time, constants.time.minTime);

    if (!constants.allowedMimetype.includes(mimetype)) {
        time *= constants.otherMultiplier;
    }

    return Math.round(time * 1000);
}

function isWorkingDay(day: number): boolean {
    return day >= 1 && day <= 5;
}

function changeDayIfNotWorking(date: Date): boolean {
    if (!isWorkingDay(date.getDay())) {
        date.getDay() === 0 ?
            date.setDate(date.getDate() + 1) :
            date.setDate(date.getDate() + 2);
        return true;
    }
    return false;
}

export function calculateDate(currentDate: Date, time: number): Date {
    const deadline = new Date(currentDate.getTime());

    if (deadline.getHours() < 10) {
        deadline.setHours(10, 0, 0, 0);
    } else if (deadline.getHours() >= 19) {
        deadline.setHours(10, 0, 0, 0);
        deadline.setDate(deadline.getDate() + 1);
    }

    if (changeDayIfNotWorking(deadline))
        deadline.setHours(10, 0, 0 , 0);


    const dayEnd = new Date(deadline.getTime());
    dayEnd.setHours(19, 0 , 0 ,0)


    if (dayEnd.getTime() - deadline.getTime() >= time) {
        deadline.setTime(deadline.getTime() + time);
        return deadline;
    }

    time -= (dayEnd.getTime() - deadline.getTime());
    deadline.setDate(deadline.getDate() + 1);
    deadline.setHours(10, 0, 0 , 0);
    changeDayIfNotWorking(deadline);

    while (time > 1000 * 60 * 60 * 9) {

        deadline.setDate(deadline.getDate() + 1);
        changeDayIfNotWorking(deadline);

        time -= 1000 * 60 * 60 * 9;
    }

    deadline.setTime(deadline.getTime() + time);
    return deadline
}
