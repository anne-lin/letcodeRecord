/**
 * Created by mengchen on 2015/3/30.
 */

(function(KS, $) {

    "use strict";

    if (!$) {
        throw new ReferenceError("$ is undefined, please import jQuery first.");
    }

    var defaults = {
        OK : "确定",
        CANCEL : "取消",
        TIP : "提示"
    };

    var dialog = {
        show : function() {
            $("#ks-dialog").css({
                left: ($(window).width() - $("#ks-dialog").width()) / 2 + "px",
                top: "30px"
            }).show();
            $("#ks-dialog-shade").show();
        },
        hide : function() {
            $("#ks-dialog").hide();
            $("#ks-dialog-shade").hide();
        },
        setMessage : function(message) {
            $("#ks-dialog-content").text(message);
            return this;
        },
        setType : function(type) {
            if (type === "confirm") {
                $("#ks-dialog-cancel").show();
                $("#ks-dialog-ok").removeClass("primary danger").addClass("danger");
            } else if (type === "alert") {
                $("#ks-dialog-cancel").hide();
                $("#ks-dialog-ok").removeClass("primary danger").addClass("primary");
            }
            return this;
        },
        callback : null
    };

    var buildDialog = function(callback) {
        if (!$("#ks-dialog").get(0)) {
            var html = "";
            html += ("<div class=\"ks-dialog\" id=\"ks-dialog\">");
            html += ("    <div class=\"ks-dialog-title\" id=\"ks-dialog-title\">" + defaults.TIP);
            html += ("    <span class='ks-dialog-close' id=\"ks-dialog-close\">&times</span></div>");
            html += ("    <div class=\"ks-dialog-body\">");
            html += ("        <p id=\"ks-dialog-content\"></p>");
            html += ("        <p class=\"ks-text-right\">");
            html += ("            <button class=\"ks-button danger\" id=\"ks-dialog-ok\">" + defaults.OK + "</button>");
            html += ("            <button class=\"ks-button slave\" id=\"ks-dialog-cancel\">" + defaults.CANCEL + "</button>");
            html += ("        </p>");
            html += ("    </div>");
            html += ("</div>");
            //html += ("<div class=\"ks-dialog-shade\" id=\"ks-dialog-shade\"></div>");

            $(document.body).append(html);

            $("#ks-dialog-ok").bind("click", function() {
                dialog.hide();
                if (typeof dialog.callback === "function") {
                    dialog.callback(true);
                }
            });
            $("#ks-dialog-close").bind("mousedown", function() {
                return false;
            });

            $("#ks-dialog-cancel, #ks-dialog-close").bind("click", function() {
                dialog.hide();
                if (typeof dialog.callback === "function") {
                    dialog.callback(false);
                }
            });

            KS.dragElement(
                document.getElementById("ks-dialog-title"),
                document.getElementById("ks-dialog")
            );
        }

        dialog.callback = callback;
    };

    KS.confirm = function(message, callback) {
        buildDialog(callback);
        dialog.setType("confirm").setMessage(message).show();
    };

    KS.alert = function(message) {
        buildDialog();
        dialog.setType("alert").setMessage(message).show();
    };

    $(function() {
    	$(document.body).append("<div class=\"ks-dialog-shade\" id=\"ks-dialog-shade\"></div>");
    });

    $.fn.extend({
        ksDialog: function(param) {
            var $dialogSelf = $(this);
            if (param === "init") {
                KS.dragElement(
                    $(this).find(".ks-dialog-title")[0],
                    $(this)[0]
                );
                $(this).find("[data-dialog-close], .ks-dialog-close").bind("click", function() {
                    $dialogSelf.hide();
                    $("#ks-dialog-shade").hide();
                    $dialogSelf.trigger("hide.ks.dialog");
                });
                $(this).find(".ks-dialog-close").bind("mousedown", function() {
                    return false;
                });
            } else if (param === "show") {
                $(this).css({
                    left: ($(window).width() - $(this).width()) / 2 + "px",
                    top: "30px"
                }).show();
                $("#ks-dialog-shade").show();
            } else if (param === "hide") {
                $(this).hide();
                $("#ks-dialog-shade").hide();
                $dialogSelf.trigger("hide.ks.dialog");
            }
        }
    });

    if (!window.KS) {
        window.KS = KS;
    }

})(window.KS || {}, $);