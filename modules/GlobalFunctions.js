const fs = require('fs');
const DB = require('../database/DatabaseCore');
// const DBConn = require('../storage/dbconn');
// const DBM_Log_Error = require('../database/model/DBM_Log_Error');

module.exports = {
   capitalize(words) {
      var separateWord = words.toLowerCase().split(' ');
      for (var i = 0; i < separateWord.length; i++) {
         separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
         separateWord[i].substring(1);
      }
      return separateWord.join(' ');
   },
   getCurrentDateFooterPrint(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
   },
   getCurrentDate(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
   },
   getCurrentDateTime(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      var hh = ("0" + today.getHours()).slice(-2);
      var min = ("0" + today.getMinutes()).slice(-2);
      var ss = ("0" + today.getSeconds()).slice(-2);
      return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
   },
   convertDateTime(dateTime,format=0){
      var dt = new Date(dateTime);
      switch(format){
         case 0:
         default:
            //dd/mm/yyyy
            return `${("0" + dt.getDate()).slice(-2)}/${("0" + (dt.getMonth() + 1)).slice(-2)}/${dt.getFullYear()}`;
            break;
         case 1:
            //yyyy-mm-dd
            return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)}`;
            break;
         case 2:
            //yyyy-mm-dd
            return `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}-${("0" + dt.getDate()).slice(-2)} ${("0" + dt.getHours()).slice(-2)}:${("0" + dt.getMinutes()).slice(-2)}:${("0" + dt.getSeconds()).slice(-2)}`;
            break;
      }
      
   },
   getDayName(){
      var options = {  weekday: 'short', hour12: false };
      var prnDt = new Date().toLocaleTimeString('en-us', options).split(" ");
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
      return Math.floor(Math.random() * (max - min + 1) ) + min;
   },

   str_pad_left(string,pad,length){  
      //example:
      //var finalTime = str_pad_left(minutes,'0',2) will output: 02
      return (new Array(length+1).join(pad)+string).slice(-length); 
      
   },
   discordMessageLinkFormat(id_guild,id_channel,id_messsage){
      return `https://discord.com/channels/${id_guild}/${id_channel}/${id_messsage}`;
   },
   markupCleaner(text){
      text = text.replace(/<br>/g,"");
      text = text.replace(/<i>/g,"*");
      text = text.replace(/<\/i>/g,"*");
      text = text.replace(/<b>/g,"**");
      text = text.replace(/<\/b>/g,"**");
      text = text.replace(/&#039;/g,"'");
      text = text.replace(/&quot;/g,"\"");
      return text;
   },
   // async errorLogger(error){
   //    error = `${this.getCurrentDateTime()}: ${error.toString()}\n`;
   //    fs.appendFile('error.txt', error, function (err) {
   //       if (err) throw err;
   //    });

   //    var paramInsert = new Map();
   //    paramInsert.set(DBM_Log_Error.columns.log,error.toString());
   //    await DB.insert(DBM_Log_Error.TABLENAME,paramInsert);
   // },
   removeArrayItem(arr, value) {
      var index = arr.indexOf(value);
      if (index > -1) {
        arr.splice(index, 1);
      }
      return arr;
   },
   randomArrayItem(arr){
      return arr[arr.length * Math.random() | 0];
   },
   randomProperty(obj) {
      var keys = Object.keys(obj);
      return obj[keys[ keys.length * Math.random() << 0]];
   },
   randomPropertyKey(obj) {
      var keys = Object.keys(obj);
      return keys[ keys.length * Math.random() << 0];
   },
   cutText(text,maxLength){
      //give ... from the given length
      if(text.length>=maxLength){
         return text.substring(0, maxLength) + '...';
      } else {
         return text;
      }
      
   }, getRandomArray(arr, n) {
      var result = new Array(n),
          len = arr.length,
          taken = new Array(len);
      if (n > len)
          throw new RangeError("getRandom: more elements taken than available");
      while (n--) {
          var x = Math.floor(Math.random() * len);
          result[n] = arr[x in taken ? taken[x] : x];
          taken[x] = --len in taken ? taken[len] : len;
      }
      return result;
  }, shuffleText(str) {
      var originalArray = [];
      for(var i=0;i<str.length;i++){
         originalArray.push(str[i]);
      }

      originalArray = originalArray.sort(() => Math.random() - 0.5);

      var txt = "";
      for(var i=0;i<originalArray.length;i++){
         txt+=originalArray[i];
      }

      return txt;
   }, timestampToDateTime(UNIX_timestamp){
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      var year = a.getFullYear();
      var month = months[a.getMonth()];
      var date = a.getDate();
      var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
      var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes(); 
      var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
      var time = date + '-' + month + '-' + year + ' ' + hour + ':' + min + ':' + sec ;
      return time;
   },
   calculatePercentage(original_value,percentage){
      return Math.round(original_value*(percentage/100));
   },
   calculateAddPercentage(original_value,percentage){
      return original_value+Math.round(original_value*(percentage/100));
   },
   sortObject(dataObject){
      return Object.fromEntries(
         Object.entries(dataObject).sort(([,a],[,b]) => a-b)
     );
   },
   getDateTimeDifference(dateStart,dateEnd){
      var timeRemaining = (dateStart - dateEnd ) / 1000 / 60;
      var num = timeRemaining;
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      return {hours:rhours, minutes: rminutes};
   },
   mergeObjects(obj1,obj2){
      return Object.assign({},obj1,obj2);
   },
   getCurrentWeek() {
      let monthStart = new Date();
      monthStart.setDate(0);
      let offset = (monthStart.getDay() + 1) % 7 - 1; // -1 is for a week starting on Monday
      return Math.ceil((new Date().getDate() + offset) / 7);
   },
   isEmptyObject(obj){
      return Object.keys(obj).length === 0;
   }
}