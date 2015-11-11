﻿module ngX.components {
    
    /**
     * @name Rotator
     * @module ngX.components
     */
    export class Rotator {
        constructor(
            private $attrs: ng.IAttributes,
            private $compile: ng.ICompileService,
            private $element: ng.IAugmentedJQuery,
            private $http: ng.IHttpService,
            private $interval: ng.IIntervalService,
            private $location: ng.ILocationService,
            private $q: ng.IQService,
            private $scope: ng.IScope,
            private $timeout: ng.ITimeoutService,
            private $transclude: Function,
            private getX: Function,
            private translateX: Function,
            private translateXAsync: Function) { }

        private onInit = () => {

            this.$element.find(".view-port").css("width", this.width);

            var fragment = document.createDocumentFragment();
            for (var i = 0; i < this.items.length; i++) {
                var childScope: any = this.$scope.$new(true);
                childScope[this.$attrs["rotatorForName"] || "rotatorItem"] = this.items[i];
                childScope.width = this.width;
                childScope.height = this.height;
                childScope.$$index = i;
                childScope.$$isFirst = (i === 0);
                childScope.$$isLast = (i === this.items.length - 1);
                var itemContent = this.$compile(angular.element(this.template))(childScope);
                itemContent.addClass("slide");
                fragment.appendChild(itemContent[0]);
            }
            this.containerNavtiveElement.appendChild(fragment);

            var queryStringValue = this.$location.search()[this.$attrs["querySearchField"] || 'id'];

            if (queryStringValue) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i][this.$attrs["querySearchField"] || 'id'] == queryStringValue) {
                        this.updateCurrentIndex({ currentIndex: i });
                        var promises = [];
                        this.isAnimating = true;
                        for (var h = this.slideNavtiveElements.length - 1; h > -1; h--) {
                            promises.push(this.translateXAsync({ element: this.slideNavtiveElements[h], x: (this.getX(this.slideNavtiveElements[h]) - (Number(this.width) * (i))) }));
                        }

                        this.$q.all(promises).then(() => {                            
                            this.isAnimating = false;                            
                        });
                    }
                }
            } else {
                this.updateCurrentIndex({ currentIndex: 0 });
            }

        }

        public onPreviousAsync = () => {
            var deferred = this.$q.defer();
            if (!this.isAnimating) {
                var promises = [];
                this.isAnimating = true;
                for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                    promises.push(this.translateXAsync({ element: this.slideNavtiveElements[i], x: (this.getX(this.slideNavtiveElements[i]) + Number(this.width)) }));
                }
                this.$q.all(promises).then(() => {
                    /**
                     * move tail to head
                     */
                    this.updateCurrentIndex({ currentIndex: this.currentIndex - 1 });
                    this.isAnimating = false;
                    deferred.resolve();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        public onNextAsync = () => {
            var deferred = this.$q.defer();
            if (!this.isAnimating) {
                var promises = [];
                this.isAnimating = true;
                for (var i = this.slideNavtiveElements.length - 1; i > -1; i--) {
                    promises.push(this.translateXAsync({ element: this.slideNavtiveElements[i], x: (this.getX(this.slideNavtiveElements[i]) - Number(this.width)) }));
                }
                this.$q.all(promises).then(() => {
                    /**
                     * move the head to tail
                     */
                    this.updateCurrentIndex({ currentIndex: this.currentIndex + 1 });
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

        public updateCurrentIndex = (options: any) => {
            this.currentIndex = options.currentIndex;
            this.$scope.$emit("rotatorUpdate", { scope: this.$scope });
            var url = this.items[this.currentIndex][this.$attrs["querySearchField"] || 'id'];
            this.$location.search(this.$attrs["querySearchField"] || 'id', url);
        }

        public turnOffTransitions = () => { this.$element.addClass("notransition"); }

        public turnOnTransitions() { this.$element.removeClass("notransition"); }

        private get slideNavtiveElements() { return this.containerNavtiveElement.children; }

        private clone: any;

        private currentIndex: number = 0;

        private get template() { return this.clone.find("slide")[0].innerHTML; }

        private isAnimating: boolean;

        private get containerNavtiveElement() { return this.$element.find(".container")[0]; }

        private items: any;

        private width: string;

        private height: string;
    }

    ngX.Component({
        module: "ngX.components",
        selector: "rotator",
        component: Rotator,
        transclude: "element",
        inputs: [
            "height",
            "items",
            "nextButtonImageUrl",
            "previousButtonImageUrl",
            "width"
        ],
        styles: [
            " .rotator .slide { ",
            "   transition: transform 0.5s cubic-bezier(0.1, 0.1, 0.25, 0.9); } ",

            " .rotator.notransition .slide { ",
            "  transition: none !important; } ",

            " .rotator .view-port { ",
            "   position: relative; ",
            "   overflow-x: hidden; ",
            "   overflow-y: hidden; ",
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
            "$location",
            "$q",
            "$scope",
            "$timeout",
            "$transclude",
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