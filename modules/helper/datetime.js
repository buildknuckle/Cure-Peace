const dayjs = require("dayjs");

function dateTimeNow() {
    return dayjs().format("DD/MM/YYYY HH:mm:ss");
}

function timestampToDateTime(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    const hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
    const min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
    const sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
    return `${date}-${month}-${year} ${hour}:${min}:${sec}`;
}

module.exports = {
    dayjs,
    dateTimeNow,
    timestampToDateTime
};
