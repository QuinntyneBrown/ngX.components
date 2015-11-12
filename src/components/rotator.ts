﻿﻿﻿﻿module ngX.components {
    
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
            private debounce: Function,
            private getFromUrlSync: Function,
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

            this.turnOffTransitions();

            if (this.queryStringParam && this.queryStringParam != 0) {
                for (var i = this.slideNavtiveElements.length - 1; i >= 0; i--) {

                    var initialMoveX = (-1) * (this.queryStringParamIndex * (Number(this.width)));

                    this.translateX(this.slideNavtiveElements[i], initialMoveX);
                }

                for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                    if (i < this.queryStringParamIndex - 1) {
                        this.translateX(this.slideNavtiveElements[i], initialMoveX + Number(this.width) * this.items.length);
                    }
                }

                this.currentIndex = this.queryStringParamIndex;
            } else {
                this.currentIndex = 0;
                var desiredX = Number(this.width) * (-1);
                var delta = desiredX - ((this.items.length - 1) * Number(this.width));
                this.translateX(this.rendererdNodes[this.items.length - 1].node, delta);
                this.isAnimating = false;
                
            }

            setTimeout(() => {
                this.turnOnTransitions();
            });

        }

        private onLocationChangeSuccess = () => {
            if (this.currentIndex != -1
                && this.items[this.currentIndex][this.$attrs["querySearchField"] || 'id'] != this.queryStringParam
                && this.queryStringParamIndex != this.currentIndex) {

                //TO DO: Turn off transitions for manual manipulation of location bar
                if (this.currentIndex === this.items.length -1 && this.queryStringParamIndex === 0)
                    return this.onNextAsync();

                if (this.currentIndex === 0 && this.queryStringParamIndex === this.items.length - 1)
                    return this.onPreviousAsync();

                if ((this.currentIndex - this.queryStringParamIndex) < 0) {
                    return this.onNextAsync();
                } else {
                    return this.onPreviousAsync();
                }
                
            }
        }

        public get queryStringParam() { return this.$location.search()[this.$attrs["querySearchField"] || 'id']; }

        public get queryStringParamIndex() {
            var value = -1;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i][this.$attrs["querySearchField"] || 'id'] == this.queryStringParam) {
                    value = i;
                }
            }
            return value;
        }

        public onPreviousAsyncDebounce = () => { this.debounce(this.onPreviousAsync, 100)(); }

        public onPreviousAsync = () => {
            return this.move({ x: (Number(this.width)) }).then(() => {
                this.turnOffTransitions();
                var desiredX = Number(this.width) * (-1);
                var delta = desiredX - this.rendererdNodes[this.items.length - 1].offsetLeft;
                this.translateX(this.rendererdNodes[this.items.length - 1].node, delta);
                this.inTransition = true;
                this.currentIndex = (this.currentIndex === 0) ? this.items.length - 1: this.currentIndex - 1;
                setTimeout(() => {
                    this.turnOnTransitions();
                    this.inTransition = false;
                }, 300);
            });
        }

        public onNextAsyncDebounce = () => { this.debounce(this.onNextAsync, 100)(); }

        public onNextAsync = () => {
            return this.move({ x: (-1) * (Number(this.width)) }).then(() => {
                this.turnOffTransitions();
                var desiredX = Number(this.width) * (this.items.length - 2);
                var delta = desiredX - this.rendererdNodes[0].offsetLeft;
                this.translateX(this.rendererdNodes[0].node, delta);
                this.inTransition = true;
                this.currentIndex = (this.currentIndex === this.items.length - 1) ? 0 : this.currentIndex + 1;
                setTimeout(() => {
                    this.turnOnTransitions();
                    this.inTransition = false;
                }, 300);
            });
        }

        public move = (options: any) => {
            var deferred = this.$q.defer();
            if (!this.isAnimating && !this.inTransition) {
                var promises = [];
                this.isAnimating = true;

                if (options.x < 0) {
                    for (var i = this.slideNavtiveElements.length - 1; i > -1; i--) {
                        promises.push(this.translateXAsync({ element: this.slideNavtiveElements[i], x: (this.getX(this.slideNavtiveElements[i]) + options.x) }));
                    }
                }
                if (options.x >= 0) {
                    for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                        promises.push(this.translateXAsync({ element: this.slideNavtiveElements[i], x: (this.getX(this.slideNavtiveElements[i]) + options.x) }));
                    }
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

        public atBegining() { return this.currentIndex == 0; }

        public atEnd() { return this.currentIndex == this.items.length - 1; }

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


        public turnOffTransitions = () => { this.$element.addClass("notransition"); }

        public turnOnTransitions() { this.$element.removeClass("notransition"); }

        private get slideNavtiveElements() { return this.containerNavtiveElement.children; }

        private clone: any;

        private _currentIndex: number = -1;

        private get currentIndex() { return this._currentIndex; }

        private set currentIndex(value: number) {
            this._currentIndex = value;
            this.$scope.$emit("componentUpdate", { scope: this.$scope });
            var url = this.items[this.currentIndex][this.$attrs["querySearchField"] || 'id'];
            this.$location.search(this.$attrs["querySearchField"] || 'id', url);
        }

        private _template: string = null;

        private get template() {
            if (this._template != null)
                return this._template;

            if (this.$attrs["contentUrl"]) {
                this._template = this.getFromUrlSync({ url: this.$attrs["contentUrl"] });
            } else {
                this._template = this.clone.find("content")[0].innerHTML;
            }
            return this._template;
        }

        private isAnimating: boolean;

        private inTransition: boolean;

        private get containerNavtiveElement() { return this.$element.find(".container")[0]; }

        private items: any;

        private width: string;

        private height: string;

        private get rendererdNodes() {
            var renderedNodes = [];

            for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                var x = this.getX(this.slideNavtiveElements[i]);
                var offsetLeft = (<HTMLElement>this.slideNavtiveElements[i]).offsetLeft;
                var left = x + offsetLeft;
                var node = this.slideNavtiveElements[i];
                renderedNodes.push({
                    x: x,
                    offsetLeft: offsetLeft,
                    left: left,
                    node: node
                });
            }

            return renderedNodes.sort((a: any, b: any) => {
                return a.left - b.left;
            });
        }
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
            " .slide { ",
            "   transition: transform 0.5s cubic-bezier(0.1, 0.1, 0.25, 0.9); } ",

            " .notransition .slide { ",
            "  transition: none !important; } ",

            " .rotator .view-port { height:100%; ",
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
            "   opacity: .3; ",
            "   transition: all .250s; } ",

            " .rotator .view-port .next-arrow img { ",
            "   left: calc(100% - 80px); } ",

            " .rotator .view-port .container { ",
            "   width: 99999px; } ",

            " .rotator .view-port .previous-arrow img:hover, ",
            " .rotator .view-port .next-arrow img:hover { ",
            "   opacity: .9; transform: scale(1.5,1.5); } ",

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
            "debounce",
            "getFromUrlSync",
            "getX",
            "translateX",
            "translateXAsync"
        ],
        template: [
            "<div class='rotator'> ",
            "<div class='view-port'>",
            "<div class='container'></div>",
            "<div class='previous-arrow' data-ng-click='vm.onPreviousAsyncDebounce()'>&nbsp;<img src='{{ vm.previousButtonImageUrl }}' /></div>",
            "<div class='next-arrow' data-ng-click='vm.onNextAsyncDebounce()'>&nbsp;<img src='{{ vm.nextButtonImageUrl }}' /></div>",
            "</div>",
            "</div>"
        ].join(" ")
    });
}