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

        private onInit = () => {

            this.$transclude(this.$scope, (clone: ng.IAugmentedJQuery) => {
                this.clone = clone;
                var fragment = document.createDocumentFragment();
                var template = this.getHtml(<HTMLElement>this.clone[0].children[0], true);
                for (var i = 0; i < this.items.length; i++) {
                    var childScope: any = this.$scope.$new(true);
                    childScope[this.$attrs["rotatorForName"] || "rotatorItem"] = this.items[i];
                    childScope.$$index = i;
                    childScope.$$isFirst = (i === 0);
                    childScope.$$isLast = (i === this.items.length - 1);
                    var itemContent = this.$compile(angular.element(template))(childScope);
                    itemContent.addClass("slide");
                    fragment.appendChild(itemContent[0]);
                }
                this.containerNavtiveElement.appendChild(fragment);
            });


        }

        public onNextAsync = () => {
            var deferred = this.$q.defer();
            if (!this.isAnimating) {
                var promises = [];
                this.isAnimating = true;
                for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                    promises.push(this.translateXAsync({ element: this.slideNavtiveElements[i], x: 100 }));
                }
                this.$q.all(promises).then(() => {
                    this.isAnimating = false;
                    deferred.resolve();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        public onPreviousAsync = () => {
            var deferred = this.$q.defer();
            if (!this.isAnimating) {
                var promises = [];
                this.isAnimating = true;
                for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                    promises.push(this.translateXAsync({ element: this.slideNavtiveElements[i], x: 100 }));
                }
                this.$q.all(promises).then(() => {
                    this.isAnimating = false;
                    deferred.resolve();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        public dispose = () => {
            angular.element(this.containerNavtiveElement).find(".slide").remove();
            this.containerNavtiveElement.innerHTML = "";
            this.$element[0].innerHTML = null;
            this.$element = null;
            this.$attrs = null;
            this.clone = null;
            delete this.$element;
            delete this.clone;
        }

        private isAnimating: boolean;

        private slideNavtiveElements: any;

        private clone: any;

        private containerNavtiveElement: any;

        private items:any;

    }

    ngX.Component({
        module:"ngX.components",
        selector: "rotator",
        component: Rotator,
        inputs: [
            "previousButtonImageUrl",
            "nextButtonImageUrl"
        ],
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
            "<div class='rotator'> ",
            "<div class='view-port'>",
            "<div class='container'></div>",
            "<div class='previous-arrow' data-ng-click='vm.onPreviousAsync()'><img src='{{ vm.previousButtonImageUrl }}' /></div>",
            "<div class='next-arrow' data-ng-click='vm.onNextAsync()'><img src='{{ vm.nextButtonImageUrl }}' /></div>",
            "</div>",
            "</div>"
        ].join(" ")
    });
}