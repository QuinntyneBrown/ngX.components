﻿﻿﻿module ngX.components {
    
       var config = {};

       config["default"] = {
           startIndex: 0,
           buffer:2
       };

       angular.module("ngX.components").value("carouselConfig", config);    
    /**
     * @name carousel
     * @module ngX.components
     */
    export class carousel {
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
            private carouselConfig: any,
            private debounce: Function,
            private getFromUrlSync: Function,
            private getX: Function,
            private translateX: Function,
            private translateXAsync: Function) { }

        private get startIndex() {            
            return this.carouselConfig.default.startIndex;
        }

        private onInit = () => {

            this.$element.find(".view-port").css("width", this.$element.width());

            var fragment = document.createDocumentFragment();

            for (var i = 0; i < this.items.length; i++) {
                var childScope: any = this.$scope.$new(true);
                childScope[this.$attrs["carouselForName"] || "carouselItem"] = this.items[i];
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

            

            setTimeout(() => {

                this.currentIndex = 0;

                this.setCurrentCssClass();

                this.turnOffTransitions();
                
                for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                    this.slideNavtiveElements[i].classList.add('notransition');
                    this.translateX(this.slideNavtiveElements[i], this.startIndex);
                    this.slideNavtiveElements[i].classList.remove('notransition');                    
                }

                for (var i = 1; i <= this.buffer; i++) {
                    var desiredX = -1 * (Number(this.width) * i);
                    var delta = desiredX - ((this.items.length - i) * Number(this.width));
                    this.rendererdNodes[this.items.length - 1].node.classList.add('notransition');
                    this.translateX(this.rendererdNodes[this.items.length - 1].node, delta + this.startIndex);
                    this.rendererdNodes[this.items.length - 1].node.classList.remove('notransition');
                    this.isAnimating = false;
                }
                
                setTimeout(() => { this.turnOnTransitions(); });

            }, 300);


        }

        setCurrentCssClass = () => {
            for (var i = 0; i < this.items.length - 1; i++) {
                this.slideNavtiveElements[i].classList.remove("current");
            }
            this.slideNavtiveElements[this.currentIndex].classList.add("current");
        }

        private get buffer() { return this.carouselConfig.default.buffer; }

        public onPreviousAsyncDebounce = () => { this.debounce(this.onPreviousAsync, 100)(); }

        public onPreviousAsync = () => {

            return this.move({ x: (Number(this.width)) }).then(() => {
                this.turnOffTransitions();                
                var desiredX = -1 * (Number(this.width) * this.buffer);
                var delta = desiredX - this.rendererdNodes[this.items.length - 1].offsetLeft;
                this.rendererdNodes[0].node.classList.add('notransition');
                this.translateX(this.rendererdNodes[this.items.length - 1].node, delta + this.startIndex);
                this.isAnimating = false;
                setTimeout(() => {
                    this.rendererdNodes[0].node.classList.remove('notransition');
                    if (this.currentIndex == 0) {
                        this.currentIndex = this.items.length - 1
                    }
                    else {
                        this.currentIndex = this.currentIndex - 1;
                    }
                    this.setCurrentCssClass();
                    this.turnOnTransitions();
                });
            });
        }

        public onNextAsyncDebounce = () => { this.debounce(this.onNextAsync, 100)(); }

        public onNextAsync = () => {
            return this.move({ x: (-1) * (Number(this.width)) }).then(() => {
                this.turnOffTransitions();
                var desiredX = (this.items.length - 1 - this.buffer) * Number(this.width);
                var delta = desiredX - this.rendererdNodes[0].offsetLeft;
                var display = this.rendererdNodes[0].node.style.display;
                this.rendererdNodes[0].node.classList.add('notransition');
                this.translateX(this.rendererdNodes[0].node, delta + this.startIndex);                
                this.isAnimating = false;
                setTimeout(() => {
                    this.rendererdNodes[0].node.classList.remove('notransition');
                    this.turnOnTransitions();
                    if (this.currentIndex == this.items.length - 1) {
                        this.currentIndex = 0;
                    }
                    else {
                        this.currentIndex = this.currentIndex + 1;
                    }

                    this.setCurrentCssClass();
                });
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
        selector: "carousel",
        component: carousel,
        transclude: "element",
        inputs: [
            "height",
            "items",
            "nextButtonImageUrl",
            "previousButtonImageUrl",
            "width"
        ],
        styles: [
            " .carousel .slide { ",
            "   transition: transform 0.5s cubic-bezier(0.1, 0.1, 0.25, 0.9); } ",

            " .notransition .slide { ",
            "  transition: none !important; } ",

            " .carousel .view-port { height:100%; ",
            "   position: relative; ",
            "   overflow-x: hidden; ",
            "   overflow-y: hidden; ",
            " } ",

            " .carousel .view-port .previous-arrow, ",
            " .carousel .view-port .next-arrow { ",
            "   background-color: #fff; z-index:999; height:100%;",
            " } ",

            " .carousel .view-port .previous-arrow img, ",
            " .carousel .view-port .next-arrow img { ",
            "   position: absolute; ",
            "   top: calc(50% - 40px); ",
            "   cursor: pointer; ",
            "   left: 0; ",
            "   z-index: 999; ",
            "   opacity: .3; ",
            "   transition: all .250s; } ",

            " .carousel .view-port .next-arrow img { ",
            "   left: calc(100% - 80px); } ",

            " .carousel .view-port .container { ",
            "   width: 99999px; } ",

            " .carousel .view-port .previous-arrow img:hover, ",
            " .carousel .view-port .next-arrow img:hover { ",
            "   opacity: .9; transform: scale(1.5,1.5); } ",

            " .carousel .view-port .slide { ",
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
            "carouselConfig",
            "debounce",
            "getFromUrlSync",
            "getX",
            "translateX",
            "translateXAsync"
        ],
        template: [
            "<div class='carousel'> ",
            "<div class='view-port'>",
            "<div class='container'></div>",
            "<div class='previous-arrow' data-ng-click='vm.onPreviousAsyncDebounce()'>&nbsp;<img src='{{ vm.previousButtonImageUrl }}' /></div>",
            "<div class='next-arrow' data-ng-click='vm.onNextAsyncDebounce()'>&nbsp;<img src='{{ vm.nextButtonImageUrl }}' /></div>",
            "</div>",
            "</div>"
        ].join(" ")
    });
}