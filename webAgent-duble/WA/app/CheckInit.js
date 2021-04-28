/**
 * Created by fei on 2015/12/4.
 */

define(["wa_Constant", "wa_Vm", "wa_Storage", "wa_RegisterHandler"],function(constant, vm, storage, registerHandler) {
    "use strict";

    /**
     * 自动登录是否完成(不论成功或失败)
     * (当收到autoLogin的result时修改为true)
     * @type {boolean}
     */
    var autoLoginFinished = false;

    /**
     * 自动登录是否成功
     * @type {boolean}
     */
    var autoLoginResult = false;

    /**
     * UI元素是否初始化成功
     * (当ko,css,dom,bindings等都完成时修改为true)
     * @type {boolean}
     */
    var initUISuccess = false;

    /**
     * 调用WA.init()传入的回调函数
     * 当initUISuccess和autoLoginFinished都为true时触发
     * @type {null}
     */
    var initSuccessCallback = null;

    /**
     * 自动登录返回的数据
     *
     */
    var autoLoginData = null;

    function checkInitSuccess() {

        if (initUISuccess && autoLoginFinished) {

            // 在自动登录未成功时，从localStorage中恢复登录信息
            if (!autoLoginResult) {
                storage.resumeLoginInfo();
            }

            if (typeof initSuccessCallback === "function") {
                setTimeout(function() {
                    initSuccessCallback(autoLoginResult,autoLoginData);
                    if(autoLoginData.type === constant.commands.AUTO_LOGIN) {
                        registerHandler.triggerResult(autoLoginData);
                    }
                    initSuccessCallback = null;
                }, 300);
            }
        }
    }

    return {
        setAutoLoginFinish: function() {
            autoLoginFinished = true;
            return this;
        },
        autoLoginResult: function(value) {
            autoLoginResult = value;
        },
        autoLoginData: function(value) {
            autoLoginData = value;
        },
        setInitUISuccess: function() {
            initUISuccess = true;
            return this;
        },
        initSuccessCallback: function(value) {
            initSuccessCallback = value;
        },
        checkInitSuccess: checkInitSuccess
    }
});