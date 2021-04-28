/**
 * Created by mengchen on 2015/11/23.
 */

define(["knockout", "util", "css!weixinEmojiC", "weixinEmojiJ", "weixinEmojiExtend"], function(ko, util) {
    return function(text, direction, type, dates, name , messageId) {
        messageId  = messageId === null || messageId === undefined ? "null" : messageId;
    
        var DIRECTION = {
            SEND : "send",
            RECV : "recv",
            TIP :  "tip"
        };

        //转义特殊字符
        if(type == "text") {
/*            if(direction == DIRECTION.SEND) {
                    text = text.replace(/&/g,"&amp;")
                     .replace(/</g,"&lt;")
                     .replace(/>/g,"&gt;")
                     .replace(/\"/g,"&quot;");
                }
                text = WeixinEmojiExtend.replace(require("Vm").checkUrl(text));

            }*/

            text = text && text.replace(/\n/g,"<br/>");
            //else {
            //    text = require("Vm").checkUrl(text);
            //}
        }

        this.text = text;
        this.direction = (direction || DIRECTION.RECV);
        this.type = type;
        this.messageId = messageId;
        this.isShowWithdrawBtn = this.direction == DIRECTION.SEND && this.messageId;
        //this.dateObj = dates;

        //获取聊天记录里的时间不需要转换，实时发送的消息需要转换
        if(dates instanceof Date) {
            this.time = function() {
               return util.FormatDate(dates);
            }
        } else {
            this.time = ko.observable(dates);
        }

        this.name = name;
    };
});
