/**
 * 常量模块
 */
define([], function() {
    "use strict";

    /**
     * 状态集
     */
    var states = {
        INIT : { key: "INIT", desc: "初始化" },
        LOGINING : {key: "LOGINING", desc: "登录中"},
        LOGOUT : { key: "LOGOUT", desc: "登出" },
        READY : { key: "READY", desc: "置闲" },
        WORKING : { key: "WORKING", desc: "工作状态" },
        CONNECTING : { key: "CONNECTING", desc: "正在呼叫" },
        AGENT_ALERTING : { key: "AGENT_ALERTING", desc: "坐席振铃"},
        AGENT_CONNECTED : { key: "AGENT_CONNECTED", desc: "坐席接通" },
        CUSTOM_ALERTING : { key: "CUSTOM_ALERTING", desc: "客户振铃" },
        CONNECTED : { key: "CONNECTED", desc: "双方通话" },
        INTERNAL_ALERTING : { key: "INTERNAL_ALERTING", desc: "内呼振铃" },
        INTERNAL_CONNECTED : { key: "INTERNAL_CONNECTED", desc: "内呼接通" },
        ACW : { key: "ACW", desc: "事后整理" },
        BUSY : { key: "BUSY", desc: "置忙" },
        AWAY : { key: "AWAY", desc: "小休" },
        HOLD : { key: "HOLD", desc: "保持" },
        BEHOLD : { key: "BEHOLD", desc: "被保持" },
        CONSULTING : { key: "CONSULTING", desc: "正在咨询" },
        CONSULT_ALERTING : { key: "CONSULT_ALERTING", desc: "咨询振铃" },
        CONSULT_B_ALERTING : { key: "CONSULT_B_ALERTING", desc: "被咨询振铃" },
        CONSULTED : { key: "CONSULTED", desc: "咨询接通" },
        CONSULTED_B : { key: "CONSULTED_B", desc: "被咨询接通" },
        TRANSFERRING : { key: "TRANSFERRING", desc: "正在转移" },
        TRANSFER_ALERTING : { key: "TRANSFER_ALERTING", desc: "转移振铃" },
        CONFERENCING : { key: "CONFERENCING", desc: "正在会议" },
        CONFERENCED : { key: "CONFERENCED", desc: "会议中" },
        OBSERVING : { key: "OBSERVING", desc: "正在监听" },
        OBSERVE_ALERTING : { key: "OBSERVE_ALERTING", desc: "监听振铃" },
        OBSERVED : { key: "OBSERVED", desc: "监听接通" },
        INSERTING : { key: "INSERTING", desc: "正在强插" },
        FORCE_ABORTING : { key: "FORCE_ABORTING", desc: "正在强拆" },
        FULL_ABORTING : { key: "FULL_ABORTING", desc: "正在全拆" },
        MP_CONFERENCING: { key: "MP_CONFERENCING", desc: "正在四方会议" },
        MP_CONFERENCE: { key: "MP_CONFERENCE", desc: "四方会议中" },
        MP_CONFERENCE_ALERTING_OP:{ key: "MP_CONFERENCE", desc: "四方会议振铃" },
        MP_CONFERENCE_ALERTING_TP:{ key: "MP_CONFERENCE_ALERTING_TP", desc: "四方会议振铃" },
        MP_CONFERENCE_OP: { key: "MP_CONFERENCE_OP", desc: "四方会议接通" },
        MP_CONFERENCE_TP : { key: "MP_CONFERENCE_TP", desc: "四方会议接通" },
        CRYPTOLALIA: { key: "CRYPTOLALIA", desc: "密语中" },
        LAUNCH_CRYPTOLALIA: { key: "LAUNCH_CRYPTOLALIA", desc: "发起密语" },
        SINGLE_STEP_CONFERENCE_ALERTING : { key: "SINGLE_STEP_CONFERENCE_ALERTING", desc: "单步会议振铃" },
    };

    /**
     * 命令集
     */
    var commands = {
        LOGIN : "login",
        AUTO_LOGIN : "autoLogin",
        FORCE_LOGIN : "forceLogin",
        LOGOUT : "logout",
        SET_BUSY : "setBusy",
        SET_AWAY : "setAway",
        SET_READY : "setReady",
        SET_WORKING : "sayWorkState",
        MAKE_CALL : "makeCall",
        MAKE_CALL_INTERNAL : "makeCall-Internal",
        HANGUP : "hangup",
        RESET : "reset",
        HOLD : "hold",
        HOLD_RETURN : "holdReturn",
        AGENTGETLIST: "agentGetList",
        CONSULT : "consult",
        CONSULT_RETURN : "consultReturn",
        TRANSFER : "transfer",
        SINGLE_TRANSFER : "singleTransfer",
        OBSERVE : "observe",
        INTERCEPT: "intercept",
        FORCE_INSERT : "forceInsert",
        FORCE_ABORT : "forceAbort",
        FULL_ABORT : "fullAbort",
        CONFERENCE : "conference",
        ASSIST_IVR : "assistIVR",
        ROUTER_TO_IVR : "routerToIvr",
        SET_CALL_DATA : "setCallData",
        GET_CALL_DATA : "getCallData",
        PUSH_VIDEO : "fileBroadcast",
        SINGLE_CONFERENCE:"singleConference",
        SECOND_CALL:"secondCall",
        JOIN_CONFERENCE:"joinConference", // 多人会议发起
        START_CRYPTO:'startCrypto', // 开启密语
        STOP_CRYPTO:'stopCrypto', // 关闭密语
        SWITCH_SKILL_GROUP:'switchSkillGroup', // 切换技能组
    };

    /**
     * 事件集
     */
    var events = {
        EVENT_AGENT_LOGIN : "EVENT_AGENT_LOGIN",            // 登录成功
        EVENT_NETTY_LOGIN_SUCCESS : "EVENT_NETTY_LOGIN_SUCCESS", // Netty方式登录成功（用于已存在http客户端登录的前提下）
        EVENT_AGENT_LOGOUT : "EVENT_AGENT_LOGOUT",          // 登出成功
        EVENT_AGENT_LOGIN_FAIL : "EVENT_AGENT_LOGIN_FAIL",  // 登录失败
        EVENT_AGENT_READY : "EVENT_AGENT_READY",             // 置闲
        EVENT_AGENT_NOTREADY : "EVENT_AGENT_NOTREADY",       // 置忙
        EVENT_AGENT_AWAY : "EVENT_AGENT_AWAY", //小休成功
        EVENT_SET_AWAY_FAIL : "EVENT_SET_AWAY_FAIL", //小休失败
        EVENT_CALL_CONTROL_FAIL : "EVENT_CALL_CONTROL_FAIL",    // 话路控制失败
        EVENT_OUTBOUND_ALERTING_TP : "EVENT_OUTBOUND_ALERTING_TP", // 外呼坐席振铃
        EVENT_OUTBOUND_CONNECTED_TP : "EVENT_OUTBOUND_CONNECTED_TP", // 外呼坐席接通
        EVENT_OUTBOUND_ALERTING_OP : "EVENT_OUTBOUND_ALERTING_OP",  // 外呼客户振铃
        EVENT_OUTBOUND_CONNECTED_OP : "EVENT_OUTBOUND_CONNECTED_OP", // 外呼客户接通
        EVENT_TP_DISCONNECT : "EVENT_TP_DISCONNECT",                 // 坐席挂断
        EVENT_OP_DISCONNECT : "EVENT_OP_DISCONNECT",                 //客户挂断
        EVENT_INBOUND_ALERTING : "EVENT_INBOUND_ALERTING",          // 呼入坐席振铃事件
        EVENT_INBOUND_CONNECTED : "EVENT_INBOUND_CONNECTED",           // 呼入坐席接通事件
        EVENT_INTERNAL_ALERTING_TP : "EVENT_INTERNAL_ALERTING_TP",       // 内呼坐席振铃事件(发起内呼坐席)
        EVENT_INTERNAL_CONNECTED_TP : "EVENT_INTERNAL_CONNECTED_TP",    // 内呼坐席接通事件(发起内呼坐席)
        EVENT_INTERNAL_ALERTING_OP : "EVENT_INTERNAL_ALERTING_OP",      // 内呼坐席振铃事件(被内呼坐席)
        EVENT_INTERNAL_CONNECTED_OP : "EVENT_INTERNAL_CONNECTED_OP",       // 内呼坐席接通事件(被内呼坐席)
        EVENT_AGENT_HOLD : "EVENT_AGENT_HOLD",                       // 坐席保持
        EVENT_HOLD_RETRIEVE : "EVENT_HOLD_RETRIEVE",                 // 坐席保持接回
        EVENT_CONSULT_ALTERTING_OP : "EVENT_CONSULT_ALTERTING_OP",     // 咨询坐席振铃事件(发起咨询坐席)
        EVENT_CONSULT_CONNECTED_OP : "EVENT_CONSULT_CONNECTED_OP",    // 咨询坐席接通事件(发起咨询坐席)
        EVENT_CONSULT_RETRIEVE : "EVENT_CONSULT_RETRIEVE",               // 咨询接回事件
        EVENT_CONSULT_FAIL : "EVENT_CONSULT_FAIL",                      // 咨询失败
        EVENT_TRANSFER : "EVENT_TRANSFER",                               // 转移事件
        EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP : "EVENT_SINGLE_STEP_TRANSFER_ALERTING_TP", // 单步转移振铃事件(目标坐席)
        EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP : "EVENT_SINGLE_STEP_TRANSFER_CONNECTED_TP", // 单步转移接通事件(目标坐席)
        EVENT_CONSULT_ALERTING_TP : "EVENT_CONSULT_ALERTING_TP",         // 咨询坐席振铃事件(被咨询坐席)
        EVENT_CONSULT_CONNECTED_TP : "EVENT_CONSULT_CONNECTED_TP",      // 咨询坐席接通事件(被咨询坐席)
        EVENT_MONITOR_ALERTING : "EVENT_MONITOR_ALERTING",               // 监听振铃事件
        EVENT_MONITOR : "EVENT_MONITOR",                                  // 监听接通事件
        EVENT_MONITOR_FAIL : "EVENT_MONITOR_FAIL",                          // 监听失败
        EVENT_FORCE_CONNECT : "EVENT_FORCE_CONNECT",                      // 强插事件
        EVENT_INTRUDE_FAIL : "EVENT_INTRUDE_FAIL",                          // 强插失败
        EVENT_CLEAR_CALL : "EVENT_CLEAR_CALL",                               // 全拆事件
        EVENT_FORCE_DROP_SUCCESS : "EVENT_FORCE_DROP_SUCCESS",                               // 强拆事件
        EVENT_FORCE_DROP_FAIL : "EVENT_FORCE_DROP_FAIL",                    // 强拆失败
        EVENT_CONFERENCE : "EVENT_CONFERENCE",                               // 会议事件
        EVENT_QUIT_MONITOR_SUCCESS : "EVENT_QUIT_MONITOR_SUCCESS",           // 监听退出/强插退出
        EVENT_AGENT_ACW : "EVENT_AGENT_ACW",                                 // 事后整理
        EVENT_AGENT_BEHOLD : "EVENT_AGENT_BEHOLD",                            // 坐席被保持（客户转IVR协助）
        EVENT_AGENT_BEUNHOLD : "EVENT_AGENT_BEUNHOLD",                       // 坐席被保持接回（客户从IVR转回通话）
        EVENT_GET_ASSOCIATE_DATA : "EVENT_GET_ASSOCIATE_DATA",               // 获取随路数据返回事件
        EVENT_SET_ASSOCIATE_DATA : "EVENT_SET_ASSOCIATE_DATA",               // 设置随路数据返回事件
        EVENT_AGENT_GET_LIST: "EVENT_AGENT_GET_LIST",                       //获得坐席列表
        EVENT_SOCKET_ABNORMAL_DISCONNECT: "EVENT_SOCKET_ABNORMAL_DISCONNECT", //socket异常断开事件，不是agentproxy返回，根据socket事件自定义的事件
        EVENT_SOCKET_RECONNECTING: "EVENT_SOCKET_RECONNECTING", //socket正在重连,
        EVENT_AGENT_LOGIN_ROBOT: "EVENT_AGENT_LOGIN_ROBOT", //机器人助手登录成功
        EVENT_AGENT_LOGIN_FAIL_ROBOT: "EVENT_AGENT_LOGIN_FAIL_ROBOT", //机器人助手登录失败
        EVENT_AGENT_NOTREADY_ROBOT: "EVENT_AGENT_NOTREADY_ROBOT", //机器人助手置忙
        EVENT_AGENT_READY_ROBOT: "EVENT_AGENT_READY_ROBOT", //机器人助手置闲
        EVENT_INBOUND_CONNECTED_ROBOT: "EVENT_INBOUND_CONNECTED_ROBOT", //机器人助手接通
        EVENT_MP_CONFERENCE_ALERTING_TP: "EVENT_MP_CONFERENCE_ALERTING_TP", // 多方会议本方振铃事件 接收方：第四方坐席
        EVENT_MP_CONFERENCE_ALERTING_OP: "EVENT_MP_CONFERENCE_ALERTING_OP", // 多方会议对方振铃事件 接收方：处于会议中的所有坐席
        EVENT_MP_CONFERENCE_CONNECTED_TP: "EVENT_MP_CONFERENCE_CONNECTED_TP", // 多方会议本方接通事件 接收方：第四方坐席
        EVENT_MP_CONFERENCE_CONNECTED_OP: "EVENT_MP_CONFERENCE_CONNECTED_OP", // 多方会议对方接通事件 接收方：处于会议中的所有坐席
        EVENT_MP_CONFERENCE_DISCONNECT_TP: "EVENT_MP_CONFERENCE_DISCONNECT_TP",// 多方会议本方挂断事件,挂断坐席
        EVENT_MP_CONFERENCE_DISCONNECT_OP: "EVENT_MP_CONFERENCE_DISCONNECT_OP", // 多方会议对方挂断事件 处于会议中的所有坐席
        EVENT_JOIN_CONFERENCE_FAIL: "EVENT_JOIN_CONFERENCE_FAIL", // 加入会议失败事件 接收方：发起 joinConference 的坐席
        EVENT_STARTCRYPTO: "EVENT_STARTCRYPTO", // 开启密语成功,发起方
        EVENT_BE_STARTCRYPTO: "EVENT_BE_STARTCRYPTO", // 开启密语成功，接收方
        EVENT_STARTCRYPTO_FAIL: "EVENT_STARTCRYPTO_FAIL", // 开启密语失败
        EVENT_STOPCRYPTO: "EVENT_STOPCRYPTO", // 关闭密语成功
        EVENT_STOPCRYPTO_FAIL: "EVENT_STOPCRYPTO_FAIL", // 关闭密语失败
        EVENT_INTERCEPT_FAIL: "EVENT_INTERCEPT_FAIL", // 拦截失败
        EVENT_AGENT_WORKSTATE: "EVENT_AGENT_WORKSTATE", // 设置工作状态成功
        EVENT_SINGLE_STEP_CONFERENCE_ALERTING_OP: "EVENT_SINGLE_STEP_CONFERENCE_ALERTING_OP", // 单步会议对方振铃
        EVENT_SINGLE_STEP_CONFERENCE_ALERTING_TP: "EVENT_SINGLE_STEP_CONFERENCE_ALERTING_TP", // 单步会议本方振铃
        EVENT_SINGLE_STEP_CONFERENCE_CONNECTED_OP: "EVENT_SINGLE_STEP_CONFERENCE_CONNECTED_OP", // 单步会议对方接通
        EVENT_SINGLE_STEP_CONFERENCE_CONNECTED_TP: "EVENT_SINGLE_STEP_CONFERENCE_CONNECTED_TP", // 单步会议本方接通
        EVENT_SINGLE_STEP_CONFERENCE_FAIL: "EVENT_SINGLE_STEP_CONFERENCE_FAIL", // 单步会议失败
        EVENT_SWTCH_SKILLGROUP_SUCCESS: "EVENT_SWTCH_SKILLGROUP_SUCCESS", // 技能组切换成功
        EVENT_SWTCH_SKILLGROUP_FAIL: "EVENT_SWTCH_SKILLGROUP_FAIL", // 技能组切换失败
        
    };

    return {
        states: states,
        commands: commands,
        events: events
    }
});
