//策略模式：定义一系列算法，把他们各自封装在策略类内部。定义一个工具类使其有选择的使用这些算法

var strategies = {
    isNotEmpty: function (value,errorMsg) {
        if (!value.length) {
            return errorMsg
        }
    },
    minLength: function (value, length, errorMsg) {
        if (!value.length < length) {
            return errorMsg
        }
    },
    isMobile: function (value, errorMsg) {
        if (!/^1[3][5][8][0-9]{9}$/.test(value)) {
            return errorMsg;
        }
    },
    isPassword: function (value,errorMsg) {
        
    }
}

var Validator = function () {
    this.cache = [];
}
Validator.prototype.add = function (val, rules) {
    
    for (let i = 0; i < rules.length; i++){        
        let errorMsg = rules[i].errorMsg,
            strategy = rules[i].strategy.split(":");    
        
        this.cache.push(function () {
            let strategyFun = strategy.shift();
            strategy.unshift(val);
            strategy.push(errorMsg);
            return strategies[strategyFun].apply(null, strategy)
        });
    }
}
Validator.prototype.stat = function () {
    for (let i = 0; i < this.cache.length; i++){
        let errorMsg = this.cache[i]();
        if (errorMsg) {
            console.log(errorMsg)
            //return errorMsg;
        }
    }
}
let registerForm = {
    username: "",
    mobilePhone:1234354532
}
var validator = new Validator();
validator.add(registerForm.username, [{
    strategy: "isNotEmpty",
    errorMsg: "用户名不能为空"
}, {
    strategy: "minLength:5",
    errorMsg: "用户名不能小于5位"
    }]);
validator.add(registerForm.password, [{
    strategy: "isPassword",
    errorMsg: "密码不符合规则"
}]);
validator.stat();