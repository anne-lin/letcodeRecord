/**
 * 工具类
 */
define([], function () {
    "use strict";
    
    function formatSkillInfo(data) {
        let skillList = data.split(';');
        let arr = [];
        skillList.forEach(function (item, index) {
            if (index !== skillList.length - 1) {
                let itemArr = item.split('=');
                arr.push({
                    value: item,
                    skillName: itemArr[0],
                    checked: true
                });
            }
        });
        return arr;
    }
    
    
    return {
        formatSkillInfo: formatSkillInfo
    };
});
