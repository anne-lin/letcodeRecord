/**
 * 信息存储模块
 */
define(["wa_Vm"], function(vm) {
    "use strict";

    var KEYS = {
        ENT_ID: "WA_ENTID",
        AGENT_ID: "WA_AGENTID",
        AGENT_NUMBER: "WA_AGENT_NUMBER",
        AGENT_PASSWORD: "WA_AGENT_PASSWORD",
        REMEMBER_LOGIN: "WA_REMEMBER_LOGIN"
    };

    var ls = window.localStorage;
    
    function saveLoginInfo() {
        ls.setItem(KEYS.ENT_ID, vm.entId());
        ls.setItem(KEYS.AGENT_ID, vm.agentId());
        ls.setItem(KEYS.AGENT_NUMBER, vm.agentNumber());
        ls.setItem(KEYS.AGENT_PASSWORD, vm.agentPassword());
        ls.setItem(KEYS.REMEMBER_LOGIN, vm.rememberLogin());
    }
    
    function clearLoginInfo() {
        ls.removeItem(KEYS.ENT_ID);
        ls.removeItem(KEYS.AGENT_ID);
        ls.removeItem(KEYS.AGENT_NUMBER);
        ls.removeItem(KEYS.AGENT_PASSWORD);
        ls.removeItem(KEYS.REMEMBER_LOGIN);
    }
    
    function resumeLoginInfo() {
        vm.entId(ls.getItem(KEYS.ENT_ID) ||  vm.entId());
        vm.agentId(ls.getItem(KEYS.AGENT_ID) || vm.agentId());
        vm.agentNumber(ls.getItem(KEYS.AGENT_NUMBER) || vm.agentNumber());
        vm.agentPassword(ls.getItem(KEYS.AGENT_PASSWORD) || vm.agentPassword());
        vm.rememberLogin(ls.getItem(KEYS.REMEMBER_LOGIN));
    }

    return {
        saveLoginInfo: saveLoginInfo,
        clearLoginInfo: clearLoginInfo,
        resumeLoginInfo: resumeLoginInfo
    };
});