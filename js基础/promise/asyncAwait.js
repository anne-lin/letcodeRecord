function getSomething() {
    return "something";
}

async function testAsync() {
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log("log1:",v1, v2);
    return v2;
}

console.log(test().then((res)=>{
    return res
}));