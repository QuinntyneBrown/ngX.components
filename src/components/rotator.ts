module ngX.components {
    
    /**
     * @name Rotator
     * @
     */
    export class Rotator {
        constructor(
            private $attrs: ng.IAttributes,
            private $compile: ng.ICompileService,
            private $element: ng.IAugmentedJQuery,
            private $http: ng.IHttpService,
            private $interval: ng.IIntervalService,
            private $q: ng.IQService,
            private $scope: ng.IScope,
            private $timeout: ng.ITimeoutService,
            private $transclude: Function,
            private getHtml: Function,
            private getX: Function,
            private translateX: Function,
            private translateXAsync: Function) {

        }

    }

    ngX.Component({
        module:"ngX.components",
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
}