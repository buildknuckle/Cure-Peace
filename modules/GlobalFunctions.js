const fs = require('fs');

module.exports = {
    capitalize(words) {
        let separateWord = words.toLowerCase().split(' ');
        for (let i = 0; i < separateWord.length; i++) {
            separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
        }
        return separateWord.join(' ');
    },
    getCurrentDateFooterPrint() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    },
    getCurrentDate() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    },
    getCurrentDateTime() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        const hh = ("0" + today.getHours()).slice(-2);
        const min = ("0" + today.getMinutes()).slice(-2);
        const ss = ("0" + today.getSeconds()).slice(-2);
        return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
    },
    convertDateTime(dateTime, format = 0) {
        const dt = new Date(dateTime);
        switch (format) {
            case 0:
            default:
                //dd/mm/yyyy
                return `${("0" + dt.getDate()).slice(-2)}/${("0" + (dt.getMonth() + 1)).slice(-2)}/${dt.getFullYear()}`;
            case 1:
                //yyyy-mm-dd
                return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)}`;
            case 2:
                //yyyy-mm-dd
                return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)} ${("0" + dt.getHours()).slice(-2)}:${("0" + dt.getMinutes()).slice(-2)}:${("0" + dt.getSeconds()).slice(-2)}`;
        }

    },
    getDayName() {
        const options = {weekday: 'short', hour12: false};
        const prnDt = new Date().toLocaleTimeString('en-us', options).split(" ");
        return prnDt[0].toLowerCase();
    },
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        return array;
    },

    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    str_pad_left(string, pad, length) {
        //example:
        //var finalTime = str_pad_left(minutes,'0',2) will output: 02
        return (new Array(length + 1).join(pad) + string).slice(-length);

    },
    discordMessageLinkFormat(id_guild, id_channel, id_messsage) {
        return `https://discord.com/channels/${id_guild}/${id_channel}/${id_messsage}`;
    },
    markupCleaner(text) {
        text = text.replace(/<br>/g, "");
        text = text.replace(/<i>/g, "*");
        text = text.replace(/<\/i>/g, "*");
        text = text.replace(/<b>/g, "**");
        text = text.replace(/<\/b>/g, "**");
        text = text.replace(/&#039;/g, "'");
        text = text.replace(/&quot;/g, "\"");
        return text;
    },
    errorLogger(error) {
        error = `${this.getCurrentDateTime()}: ${error.toString()}\n`;
        fs.appendFile('error.txt', error, function (err) {
            if (err) throw err;
        });
    },
    randomArrayItem(arr) {
        return arr[arr.length * Math.random() | 0];
    },
    randomProperty(obj) {
        const keys = Object.keys(obj);
        return obj[keys[keys.length * Math.random() << 0]];
    },
    randomPropertyKey(obj) {
        const keys = Object.keys(obj);
        return keys[keys.length * Math.random() << 0];
    },
    cutText(text, maxLength) {
        //give ... from the given length
        if (text.length >= maxLength) {
            return text.substring(0, maxLength) + '...';
        } else {
            return text;
        }

    }, getRandomArray(arr, n) {
        let result = new Array(n),
            len = arr.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            const x = Math.floor(Math.random() * len);
            result[n] = arr[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    }, shuffleText(str) {
        let i;
        let originalArray = [];
        for (i = 0; i < str.length; i++) {
            originalArray.push(str[i]);
        }

        originalArray = originalArray.sort(() => Math.random() - 0.5);

        let txt = "";
        for (i = 0; i < originalArray.length; i++) {
            txt += originalArray[i];
        }

        return txt;
    }, timestampToDateTime(UNIX_timestamp) {
        const a = new Date(UNIX_timestamp * 1000);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const year = a.getFullYear();
        const month = months[a.getMonth()];
        const date = a.getDate();
        const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
        const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
        const sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
        return date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec;
    },
    calculatePercentage(original_value, percentage) {
        return Math.round(original_value * (percentage / 100));
    },
    calculateAddPercentage(original_value, percentage) {
        return original_value + Math.round(original_value * (percentage / 100));
    },
    sortObject(dataObject) {
        return Object.fromEntries(
            Object.entries(dataObject).sort(([, a], [, b]) => a - b)
        );
    },
    getDateTimeDifference(dateStart, dateEnd) {
        const timeRemaining = (dateStart - dateEnd) / 1000 / 60;
        const hours = (timeRemaining / 60);
        const rhours = Math.floor(hours);
        const minutes = (hours - rhours) * 60;
        const rminutes = Math.round(minutes);
        return {hours: rhours, minutes: rminutes};
    },
    mergeObjects(obj1, obj2) {
        return Object.assign({}, obj1, obj2);
    },
    getCurrentWeek() {
        let monthStart = new Date();
        monthStart.setDate(0);
        let offset = (monthStart.getDay() + 1) % 7 - 1; // -1 is for a week starting on Monday
        return Math.ceil((new Date().getDate() + offset) / 7);
    }
};
