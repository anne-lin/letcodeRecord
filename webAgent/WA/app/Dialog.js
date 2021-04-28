/**
 * Created by panfei on 2016/7/19.
 */
define(["jquery", "require"], function($, require) {

    var dialog = {
        buildDialog: function(title, type, callback) {
            $(".ks-dialog-ok").unbind("click");

            require('wa_Vm').dialogType(type);
            $(".ks-dialog-title .title").text(title);

            //提交dialog
            $(".ks-dialog-ok").bind("click", function() {
                if (typeof callback === "function") {
                    callback();
                }
            });

            //取消dialog
            $(".ks-dialog-cancle").bind("click", function() {
                dialog.hide();
            });

            //取消ivr验密，调用保持接回变为双方通话
            $(".ks-dialog-ivr-cancle").bind("click", function() {
                dialog.hide();
                require('wa_Vm').holdReturnEnabled() && require('wa_Extend').holdReturn();
            });

            //ivr协助失败或者成功后，点击返回
            $(".ks-dialog-ivr-return").bind("click", function() {
                dialog.hide();
            });
        },
        hide: function() {
            require('wa_Vm').dialogShow(false);
            require('wa_Vm').ivrConfirmDialogShow(false);
        },
        show: function() {
            require('wa_Vm').dialogShow(true);
            require('wa_Vm').choiceDilogShow(true);
            require('wa_Vm').ivrConfirmDialogResult("load");
        },
        choiceDilogHide: function() {
            require('wa_Vm').choiceDilogShow(false);
        },
        ivrConfirmDialogShow: function() {
            require('wa_Vm').ivrConfirmDialogShow(true);
        }
    }

    return dialog;
});