angular.module("ngX.components", ["ngX"]);

//# sourceMappingURL=ngX.components.module.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        /**
         * @name HamburgerButton
         */
        var HamburgerButton = (function () {
            function HamburgerButton() {
            }
            return HamburgerButton;
        })();
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=hamburgerButton.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        /**
         * @name Rotator
         * @
         */
        var Rotator = (function () {
            function Rotator($attrs, $compile, $element, $http, $interval, $q, $scope, $timeout, $transclude, getHtml, getX, translateX, translateXAsync) {
                this.$attrs = $attrs;
                this.$compile = $compile;
                this.$element = $element;
                this.$http = $http;
                this.$interval = $interval;
                this.$q = $q;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$transclude = $transclude;
                this.getHtml = getHtml;
                this.getX = getX;
                this.translateX = translateX;
                this.translateXAsync = translateXAsync;
            }
            return Rotator;
        })();
        components.Rotator = Rotator;
        ngX.Component({
            module: "ngX.components",
            selector: "rotator",
            component: Rotator,
            styles: [
                " .rotator .slide { ",
                "   transition: transform 0.5s cubic-bezier(0.1, 0.1, 0.25, 0.9); } ",
                " .rotator .notransistion.slide { ",
                "  transition: none !important; } ",
                " .rotator .view-port { ",
                "   position: relative; ",
                "   overflow-x: hidden; ",
                "   overflow-y: hidden; ",
                "   width: 750px; ",
                " } ",
                " .rotator .view-port .previous-arrow img, ",
                " .rotator .view-port .next-arrow img { ",
                "   position: absolute; ",
                "   top: calc(50% - 40px); ",
                "   cursor: pointer; ",
                "   left: 0; ",
                "   z-index: 999; ",
                "   opacity: .4; ",
                "   transition: opacity .500s; } ",
                " .rotator .view-port .next-arrow img { ",
                "   left: calc(100% - 80px); } ",
                " .rotator .view-port .container { ",
                "   width: 99999px; } ",
                " .rotator .view-port .previous-arrow img:hover, ",
                " .rotator .view-port .next-arrow img:hover { ",
                "   opacity: .7; } ",
                " .rotator .view-port .slide { ",
                "   position: relative; ",
                "   float: left; ",
                "   margin: 0 auto; } "
            ].join("\n"),
            providers: [
                "$attrs",
                "$compile",
                "$element",
                "$http",
                "$interval",
                "$q",
                "$scope",
                "$timeout",
                "$transclude",
                "getHtml",
                "getX",
                "translateX",
                "translateXAsync"
            ],
            template: [
                "<div class='rotator'>",
                "</div>"
            ].join(" ")
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=rotator.js.map
