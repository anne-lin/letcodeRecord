/**
 * Created by mengchen on 2015/12/11.
 */
define(["knockout", "jquery", "text!WA/theme/cchat.html", "wa_Vm", "wa_Constant", "css!WA/theme/cchat", "css!font"], function(ko, $, wa_dom, vm, constant) {
    "use strict";

    var states = constant.states;

    $(document.body).append(wa_dom);
    var $cchat = $("#cchat");
    var WARinging = $("#WA-ringing");

    vm.numberFocus = ko.observable(false);

    //??????
    vm.ui(true);

    /**
     * ?????????table?????????????????????????????????????????????
     * @param data
     * @param event
     */
    vm.appendNumber = function(data, event) {
        var target = event.target || event.srcElement;
        if ($(target).hasClass("number-btn")) {
            var value = $(target).text();
            this.callNumber((this.callNumber() || "") + value);
            this.numberFocus(true);
        }
    };

    /**
     * ????????????λ
     */
    vm.backspace = function() {
        if (this.callNumber()) {
            var newNumber = this.callNumber().substring(0, this.callNumber().length - 1);
            this.callNumber(newNumber);
        }
        this.numberFocus(true);
    };

    vm.isAcw = ko.computed(function() {
        return vm.currentState() === states.ACW;
    });

    vm.isBusy = ko.computed(function() {
        return (vm.currentState() === states.BUSY) && !vm.dialogShow();
    });

    vm.isReady = ko.computed(function() {
        return vm.currentState() === states.READY;
    });

    vm.isObserved = ko.computed(function() {
        return vm.currentState() === states.OBSERVED;
    });
    
    vm.isWorking = ko.computed(function() {
        return vm.currentState() === states.WORKING;
    });

    vm.hangupUrl = ko.observable(WebAgent.baseUrl + "/WA/sounds/Hangup.wav");

    //????б?
    WebAgent.WaChat = {
        show: function() {
            $cchat.show();
        },
        hide: function() {
            $cchat.hide();
        },
        toggle: function() {
            $cchat.toggle();
        },
        setPosition: function(pos) {
            pos = pos || {};
            $cchat.css({
                left: pos.left,
                top: pos.top,
                right: pos.right,
                bottom: pos.bottom
            });
            return this;
        }
    };

    /*//隐藏显示可选外显号
    vm.toggleNumBox = function () {
        this.isShowNumbox(!this.isShowNumbox());
    };*/

    //查询外显号码
    /*vm.searchNum = function () {
        var outNumber;
        var search=""+this.searchNumData();
        if(search.length > 1){
            outNumber=this.outNumbersTmp().filter(function (p1) {
                return p1.number.includes(search);
            });
            this.outNumbers(outNumber.slice());
        }else {
            this.outNumbers(this.outNumbersTmp().slice());
        }
    };*/

    /*vm.chooseDisnum=function () {
        this.disNumber(this.disNumberWa());
    };*/

    //选择外显号码
    /*vm.chooseOutNum=function (data) {
        this.disNumber(data.number + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + data.area);
        this.disNumberWa(data.number + data.area);
        this.isShowNumbox(false);
    };*/

    ko.applyBindings(vm, $cchat[0]);
    ko.applyBindings(vm, WARinging[0]);
});
