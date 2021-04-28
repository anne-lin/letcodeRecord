/**
 * Created by mengchen on 2015/3/14.
 */
define(["jquery"], function($) {
    var KS = {};
    KS.dragElement = function(draggableElement, movableElement, containerElement) {

        var startMove = false;
        var pos = {
            x : 0,
            y : 0
        };

        $(draggableElement).bind("mousedown", function(event) {
            pos.x = event.clientX;
            pos.y = event.clientY;
            startMove = true;

            event.preventDefault ? event.preventDefault() : event.returnValue = false;
        });

        $(document).bind("mousemove", function(event) {
            if (!startMove) {
                return;
            }

            var clientX = event.clientX;
            var clientY = event.clientY;

            var diffX = clientX - pos.x;
            var diffY = clientY - pos.y;


            movableElement.style.left = movableElement.offsetLeft + diffX + "px";
            movableElement.style.top = movableElement.offsetTop + diffY + "px";

            if(containerElement) {
                var left = parseInt(movableElement.style.left);
                var top = parseInt(movableElement.style.top);
                var containerWidth = containerElement.offsetWidth;
                var containerHeight = containerElement.offsetHeight;
                var movableElementWidth = movableElement.offsetWidth;
                var movableElementHeight = movableElement.offsetHeight;
                var widthReduce = containerWidth - movableElementWidth;
                var heightReduce = containerHeight - movableElementHeight;

                widthReduce >= 0 ? imgWidthLt() : imgWidthGt();
                heightReduce >= 0 ? imgHeightLt() : imgHeightGt();
            }

            function imgWidthGt() {
                if(left >= 0){
                    movableElement.style.left = 0 +"px";
                }
                if(left < widthReduce){
                    movableElement.style.left = widthReduce + "px";
                }
            }

            function imgHeightGt() {
                if(top >= 0){
                    movableElement.style.top = 0+"px";
                }
                if(top < heightReduce){
                    movableElement.style.top = heightReduce + "px";
                }
            }

            function imgWidthLt() {
                if(left < 0){
                    movableElement.style.left = 0 +"px";
                }
                if(left > widthReduce){
                    movableElement.style.left = (widthReduce)+"px";
                }
            }

            function imgHeightLt() {
                if(top < 0){
                    movableElement.style.top = 0+"px";
                }
                if(top > heightReduce){
                    movableElement.style.top =(heightReduce)+"px";
                }
            }

            pos.x = clientX;
            pos.y = clientY;

            event.preventDefault ? event.preventDefault() : event.returnValue = false;
        }).bind("mouseup", function() {
            startMove = false;
        });

    };

    return KS;
})