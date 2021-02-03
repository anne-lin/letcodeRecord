var myPow = function(x, n) {
    if(n < 0){
        return 1/myPow(x,-n);
    }
    if(n == 0){
        return 1;
    }
    if(n == 1){
        return x;
    }
    return n % 2 == 0 ? myPow(x*x,n/2):x*myPow(x*x,Math.floor(n/2));
};

let x1=2,n1=-2;
let res1=myPow(x1,n1);
console.log(res1);