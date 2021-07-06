function numMd(num) {
    return num.replace(/^(\d{3})(\d{4})(\d{4})$/g, '$1****$3')
}

console.log(numMd("18310508063"));