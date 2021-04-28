/**
 * Created by fei on 2015/10/20.
 */
define(["jquery", "Drag"],function($, Drag) {

    var IMG = {};
    var containerWidth, containerHeight,
        $img, $imgContainer,
        initialWidth, initialHeight,
        isIEgt8,
        timer = null,
        ie8_deg = 0;

    var defaults = {
        deg      : 0,
        nPower   : 0,
        min_nPower : -15,
        max_nPower: 15
    };

    /**
     * 定位图片在缩小放大操作时始终居中
     * @param imgWidth
     * @param imgHeigh
     */
    function imgPosition(imgWidth,imgHeigh) {

        var $previewImage = $(".preview-image");
        //更改图片的大小
        $img.css("width", imgWidth + "px");
        $img.css("height", imgHeigh + "px");

        //获得图片与图片容器的高度差、宽度差
        var heightReduce = containerHeight - imgHeigh;
        var widthReduce = containerWidth - imgWidth;

        //居中定位图片
        $previewImage.css("top", (heightReduce / 2) + "px");
        $previewImage.css("left", (widthReduce / 2) + "px");
    }

    /**
     * 获取放大缩小的百分比
     * @param nPower
     */
    function imgPercent(nPower) {
        var $previewPercent = $(".preview-percent");
        var percent = parseInt(Math.pow(1.2,nPower) * 100) + "%";

        if($previewPercent.is(":hidden")) {
            $previewPercent.show();
        }

        $previewPercent.text(percent);

        if(timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            $(".preview-percent").hide();
        },1000);
    }

    /**
     * 图片旋转
     */
    function ie8_rotate() {
        ie8_deg = (ie8_deg + 1) % 4;
        _ie8_rotate(ie8_deg);
    }

    function _ie8_rotate(deg) {
        $img.get(0).style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ deg + ')';
    }

    function rotate() {

        if(defaults.deg === 360){
            defaults.deg = 0;
        }
        $img.css("transform", "rotate(" + (defaults.deg += 90) + "deg)");
    }

    /**
     * 图片放大
     */
    function zoomIn() {
        if (defaults.nPower >= defaults.max_nPower) {return; }

        defaults.nPower++;
        imgPosition(initialWidth * Math.pow(1.2,defaults.nPower), initialHeight * Math.pow(1.2,defaults.nPower));
        imgPercent(defaults.nPower);
    }

    /**
     * 图片缩小
     */
    function zoomOut() {
        if (defaults.nPower <= defaults.min_nPower) {return; }

        defaults.nPower--;
        imgPosition(initialWidth * Math.pow(1.2,defaults.nPower), initialHeight * Math.pow(1.2,defaults.nPower));
        imgPercent(defaults.nPower);
    }

    /**
     * 在页面渲染出模态框
     */
    function getModal() {
        if ($("#preview-div").get(0)) return;
        var modalHtml = '<div id="preview-div" class="modal fade" role="dialog" aria-hidden="true" data-backdrop="static" style="padding-left: 0">\
                        <div style="text-align: center;">\
                            <div class="preview-container">\
                                <div class="preview-img-container">\
                                    <img class="preview-image" alt="" src="" id="img">\
        	   						<div class="preview-percent"></div>\
                                     <div class="preview-buttons">\
                                        <div class="preview-btn-group">\
                                            <span id="zoomIn" title="放大"></span>\
                                            <span id="zoomOut" title="缩小"></span>\
                                            <span id="rotate-btn" title="旋转"></span>\
                                        </div>\
                                     </div>\
                                </div>\
                                <div class="preview-close" data-dismiss="modal"></div>\
                            </div>\
                        </div>\
                    </div>';

        $("#chat_pane").append(modalHtml);

        var $rotateBtn = $("#rotate-btn");
        var $zoomIn = $("#zoomIn");
        var $zoomOut = $("#zoomOut");
        $img = $("#img");
        $imgContainer = $(".preview-img-container");

        //图片拖拽
        Drag.dragElement($img.get(0), $img.get(0), $imgContainer.get(0));

        //获得图片容器的实际尺寸
        containerWidth = $imgContainer.width();
        containerHeight = $imgContainer.height();

        //判断是不是IE8
        isIEgt8 = document.implementation.hasFeature("MouseEvents","2.0");

        if(!isIEgt8) {
            //图片旋转
            $rotateBtn.bind("dblclick", function() {
                ie8_rotate();
            });

            $rotateBtn.bind("click", function() {
                ie8_rotate();
            });

            //图片放大
            $zoomIn.bind("dblclick", function() {
                zoomIn();
            });

            //图片缩小
            $zoomOut.bind("dblclick", function() {
                zoomOut();
            });
        }

        //图片旋转
        $rotateBtn.bind("click", function() {
            rotate();
        });

        //图片放大
        $zoomIn.bind("click", function() {
            zoomIn();
        });

        //图片缩小
        $zoomOut.bind("click", function() {
            zoomOut();
        });

        /**
         * 图片滚轮事件
         * 五大浏览器（IE、Opera、Safari、Firefox、Chrome）中，firefox事件名为"DOMMouseScroll",其他浏览器事件名为"mousewheel".
         */
        $imgContainer.bind("mousewheel", zoomImageOnMouse).bind("DOMMouseScroll", zoomImageOnMouse);

        function zoomImageOnMouse(event) {

            //firefox使用detail，其余四类使用wheelDelta,Firefox向上滚 > 0，其他四个浏览器相反。
            var wheel = event.originalEvent.wheelDelta || -event.originalEvent.detail;
            wheel > 0 ? zoomIn() : zoomOut();
        }

        //按钮的隐藏与出现
        $imgContainer.bind("mouseover", function(){
            $(".preview-btn-group").show();
        }).bind("mouseout", function(){
            $(".preview-btn-group").hide();
        });

    }

    /**
     * 入口
     * @param imgUrl - 图片的url
     */
    IMG.show = function(imgUrl){

        defaults.deg = 0;
        defaults.nPower = 0;
        getModal();

        var image = new Image();
        image.onload = function () {
            var realWidth = initialWidth = image.width;
            var realHeight  = initialHeight = image.height;

            while((realWidth > containerWidth) || (realHeight > containerHeight)){
                defaults.nPower--;
                realWidth = initialWidth * Math.pow(1.2, defaults.nPower);
                realHeight = initialHeight * Math.pow(1.2, defaults.nPower);
            }

            imgPercent(defaults.nPower);
            imgPosition(realWidth, realHeight);
        };

        image.src = imgUrl;
        if(!isIEgt8) {
            ie8_deg = 0;
            _ie8_rotate(ie8_deg);
        }
        $img.css("transform", "rotate(0deg)"); //重新打开时deg
        $img.attr("src",imgUrl);

        //如果bootstrap是在全局引的，需要用window下的jQuery，因为modal是在window下的jQuery扩展的，否则用requuire内部的jQuery
        $("#preview-div").modal();

        //if(window.jQuery) {
        //    window.jQuery("#preview-div").modal();
        //} else {
        //    $("#preview-div").modal();
        //}

        $(".modal-backdrop").addClass("modal-background");
    }

    return IMG;
})