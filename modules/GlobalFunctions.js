module.exports = {
   capitalize(words) {
      var separateWord = words.toLowerCase().split(' ');
      for (var i = 0; i < separateWord.length; i++) {
         separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
         separateWord[i].substring(1);
      }
      return separateWord.join(' ');
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
    }
}