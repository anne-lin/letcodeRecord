let a = {
    name: "haha"
},
    b = {
        name: "enen"
    };

function swap(x, y) {
    x.age = "18";
    [x, y] = [y, x];
}
let c = a;
c.name = "haha1";
swap(a, b);
console.log(a);

let arr = [1, 2, 3];
function changeArr(x) {
    x.pop();
}
changeArr(arr);
console.log(arr);