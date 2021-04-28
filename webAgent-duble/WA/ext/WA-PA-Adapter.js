/**
 * 为平安定制的适配层脚本，用于支持加密参数的登录接口调用
 */
define(["jquery", "wa_Log"], function($, Log) {

    "use strict";

    var config = {

        /**
         * 解密接口URL地址
         */
        //decodeHttpUrl: "http://10.130.29.42:8080/interfaceAdapter/CXcode/decode",//测试网
        decodeHttpUrl: "http://58.247.178.98:8888/interfaceAdapter/CXcode/decode",  //公网

        /**
         * 默认大企业编号
         */
        //TODO 现网上要改
        //defaultEntId: "95510"
        defaultEntId: "0000000091" //公网小域
    };

    /**
     * 存储原登录接口的引用
     * @type {Function|*}
     * @private
     */
    var _login = WA.extend.login;
    var _makeCall = WA.extend.makeCall;

    /**
     * 平安登录接口
     * @param args
     * @param args.param - 加密的内容
     * @param args.sign - 密钥
     * @returns {*}
     */
    WA.extend.login = function(args) {

        args = args || {};
        var param = args.param;
        var sign = args.sign;

        if (!param) { return { code : -2, msg : "param必填" }; }
        if (!sign) { return { code : -2, msg : "sign必填" }; }

        // 调用ajax接口获取解密内容
        $.ajax({
            url: config.decodeHttpUrl,
            type: "post",
            dataType: "json",
            data: {
                param: param,   // 此处不用手动encodeURIComponent,会自动encode
                sign: sign
            },
            success: function(data) {
                Log.log(data);
                if (data.code == 0) {
                    Log.info("decode success.");

                    var info = JSON.parse(data.msg);

                    // 使用解密数据调用登录
                    _login({
                        entId: config.defaultEntId,
                        agentId: info.agentId,
                        agentPassword: info.agentPassword,
                        agentNumber: info.agentNumber,
                        isForce: info.isForce
                    });
                }
            },
            error: function() {
                Log.error("decode error.");
            }
        });
    };

    /**
     * 平安外呼接口
     * @param args
     * @param args.param - 加密的内容
     * @param args.sign - 密钥
     * @returns {*}
     */
    WA.extend.makeCall = function(args) {

        args = args || {};
        var param = args.param;
        var sign = args.sign;

        if (!param) { return { code : -2, msg : "param必填" }; }
        if (!sign) { return { code : -2, msg : "sign必填" }; }

        // 调用ajax接口获取解密内容
        $.ajax({
            url: config.decodeHttpUrl,
            type: "post",
            dataType: "json",
            data: {
                param: param,   // 此处不用手动encodeURIComponent,会自动encode
                sign: sign
            },
            success: function(data) {
                Log.log(data);
                if (data.code == 0) {
                    Log.info("decode success.");

                    var info = JSON.parse(data.msg);

                    // 使用解密数据调用登录
                    _makeCall({
                        outCallNumber: info.outCallNumber,
                        disNumber: info.disNumber,
                        uuid: info.uuid
                    });
                }
            },
            error: function() {
                Log.error("decode error.");
            }
        });
    };
});

