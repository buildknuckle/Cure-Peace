const dayjs = require("dayjs");

function currentDateFooterPrint() {
	const today = new Date();
	const dd = String(today.getDate()).padStart(2, "0");
	// January is 0!
	const mm = String(today.getMonth() + 1).padStart(2, "0");
	const yyyy = today.getFullYear();
	return `${dd}/${mm}/${yyyy}`;
}

function dateNow() {
	return dayjs().format("DD/MM/YYYY");
}

function dateTimeNow() {
	return dayjs().format("DD/MM/YYYY HH:mm:ss");
}

function currentWeek() {
	const monthStart = new Date();
	monthStart.setDate(0);
	// -1 is for a week starting on Monday
	const offset = (monthStart.getDay() + 1) % 7 - 1;
	return Math.ceil((new Date().getDate() + offset) / 7);
}

function convertDateTime(dateTime, format = 0) {
	const dt = new Date(dateTime);
	switch (format) {
	case 0:
	default:
		// dd/mm/yyyy
		return `${("0" + dt.getDate()).slice(-2)}/${("0" + (dt.getMonth() + 1)).slice(-2)}/${dt.getFullYear()}`;
	case 1:
		// yyyy-mm-dd
		return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)}`;
	case 2:
		// yyyy-mm-dd
		return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)} ${("0" + dt.getHours()).slice(-2)}:${("0" + dt.getMinutes()).slice(-2)}:${("0" + dt.getSeconds()).slice(-2)}`;
	}

}

function dayName() {
	const options = { weekday: "short", hour12: false };
	const prnDt = new Date().toLocaleTimeString("en-us", options).split(" ");
	return prnDt[0].toLowerCase();
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

function dateTimeDifference(dateStart, dateEnd) {
	const num = (dateStart - dateEnd) / 1000 / 60;
	const hours = (num / 60);
	const rhours = Math.floor(hours);
	const minutes = (hours - rhours) * 60;
	const rminutes = Math.round(minutes);
	return { hours:rhours, minutes: rminutes };
}

module.exports = { dayjs, currentDateFooterPrint, dateNow, dateTimeNow, currentWeek, convertDateTime, dayName,
	timestampToDateTime, dateTimeDifference };