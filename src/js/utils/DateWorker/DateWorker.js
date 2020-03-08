import { WEEK_IN_MILESECS } from '../../constants/numbers';
import { DATE_LODALE, timeFormatOptions } from '../../constants/texts';

export class DateWorker {
    getTodayDate() {
        return new Date();
    }

    getWeekAgoDate() {
        const todayInMilesecs = Date.now();
        const weekAgoInMilesecs = todayInMilesecs - WEEK_IN_MILESECS;

        return new Date(weekAgoInMilesecs);
    }

    formatDateForNewsApi(date) {
        return date.toISOString();
    }

    formatDateCard(dateISO) {
        const date = new Date(dateISO);
        const day = date.toLocaleString(DATE_LODALE, timeFormatOptions);

        return day.slice(0, -3);
    }
}
