let num = "13412323234";

function getPhone(num) {
   return num.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$2")
}
console.log(getPhone(num));