module.exports = {
   capitalize(words) {
      var separateWord = words.toLowerCase().split(' ');
      for (var i = 0; i < separateWord.length; i++) {
         separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
         separateWord[i].substring(1);
      }
      return separateWord.join(' ');
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
   convertDateTime(dateTime){
      var dt = new Date(dateTime);
      return `${("0" + dt.getDate()).slice(-2)}/${("0" + (dt.getMonth() + 1)).slice(-2)}/${dt.getFullYear()}`;
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
   }

}