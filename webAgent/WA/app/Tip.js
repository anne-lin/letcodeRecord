/**
 * Created by fei on 2015/12/4.
 */
define(["jquery"],function($) {
    "use strict";

    /**
     * 界面提示消息
     * @param msg
     * @param level
     */
    return function(msg, level) {
        var $tip = $("#qn_tip");
        if ($tip.length > 0) {
            if (level == "success") {
                if (!$tip.hasClass("qn-tip-success")) {
                    $tip.addClass("qn-tip-success");
                }
            } else {
                $tip.removeClass("qn-tip-success");
            }
            $tip.text(msg || "未知错误").fadeIn(500);
            setTimeout(function () {
                $tip.fadeOut(500);
            }, 2000);
        }
    };
});