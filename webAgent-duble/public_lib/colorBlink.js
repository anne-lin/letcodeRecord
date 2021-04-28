/**
 * Created by mengchen on 2015/8/1.
 */
define(["knockout"],function(ko) {
   ko.bindingHandlers.colorBlink = {
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var timer;
            var DEFAULT_INTERVAL = 1000;
            var colors = valueAccessor();

            if (typeof colors === "function") {
                colors = colors();
            }

            if (!colors) return;

            if (colors.length === 1) {
                element.style.color = colors[0];
                //element.style.backgroundColor = colors[0];
                if (element.timer) {
                    clearInterval(element.timer);
                }
                return;
            }

            var blinkInterval = allBindings.get("interval") || DEFAULT_INTERVAL;

            var sequence = 0;
            timer = setInterval(function() {
                element.style.color = colors[(sequence++) % colors.length];
                //element.style.backgroundColor = colors[(sequence++) % colors.length];
            }, blinkInterval);

            element.timer = timer;
        }
    };
});
