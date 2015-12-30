angular.module("ngX.components", ["ngX"]);

//# sourceMappingURL=ngX.components.module.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        "use strict";
        /**
         * @name BackDrop
         * @module ngX.components
         */
        var BackDrop = (function () {
            function BackDrop($q, appendToBodyAsync, extendCssAsync, removeElement, setOpacityAsync) {
                var _this = this;
                this.$q = $q;
                this.appendToBodyAsync = appendToBodyAsync;
                this.extendCssAsync = extendCssAsync;
                this.removeElement = removeElement;
                this.setOpacityAsync = setOpacityAsync;
                this.createInstance = function (options) {
                    var instance = new BackDrop(_this.$q, _this.appendToBodyAsync, _this.extendCssAsync, _this.removeElement, _this.setOpacityAsync);
                    return instance;
                };
                this.openAsync = function () {
                    var deferred = _this.$q.defer();
                    _this.initializeAsync()
                        .then(_this.appendBackDropToBodyAsync)
                        .then(_this.showAsync)
                        .then(function () {
                        _this.isOpen = true;
                        deferred.resolve();
                    });
                    return deferred.promise;
                };
                this.closeAsync = function () {
                    var deferred = _this.$q.defer();
                    _this.hideAsync().then(function (results) {
                        _this.dispose();
                        _this.isOpen = false;
                        deferred.resolve();
                    });
                    return deferred.promise;
                };
                this.initializeAsync = function () {
                    var deferred = _this.$q.defer();
                    _this.augmentedJQuery = angular.element("<div></div>");
                    _this.extendCssAsync({
                        nativeHTMLElement: _this.nativeHTMLElement,
                        cssObject: {
                            "-webkit-transition": "opacity 300ms ease-in-out",
                            "-o-transition": "opacity 300ms ease-in-out",
                            "transition": "opacity 300ms ease-in-out",
                            "opacity": "0",
                            "position": "fixed",
                            "top": "0",
                            "left": "0",
                            "height": "100%",
                            "width": "100%",
                            "background-color": "rgba(0, 0, 0, .25)",
                            "display": "block"
                        }
                    }).then(function () {
                        deferred.resolve();
                    });
                    return deferred.promise;
                };
                this.showAsync = function () {
                    return _this.setOpacityAsync({ nativeHtmlElement: _this.nativeHTMLElement, opacity: 25 });
                };
                this.appendBackDropToBodyAsync = function () {
                    return _this.appendToBodyAsync({ nativeElement: _this.nativeHTMLElement });
                };
                this.hideAsync = function () {
                    return _this.setOpacityAsync({ nativeHtmlElement: _this.nativeHTMLElement, opacity: 0 });
                };
                this.dispose = function () {
                    _this.removeElement({ nativeHTMLElement: _this.nativeHTMLElement });
                    _this.augmentedJQuery = null;
                };
                this.isOpen = false;
                this.isAnimating = false;
            }
            Object.defineProperty(BackDrop.prototype, "nativeHTMLElement", {
                get: function () { return this.augmentedJQuery[0]; },
                enumerable: true,
                configurable: true
            });
            return BackDrop;
        })();
        components.BackDrop = BackDrop;
        angular.module("ngX.components").service("backDrop", ["$q", "appendToBodyAsync", "extendCssAsync", "removeElement", "setOpacityAsync", BackDrop]);
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=backDrop.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        var config = {};
        config["default"] = {
            startIndex: 0,
            buffer: 2
        };
        angular.module("ngX.components").value("carouselConfig", config);
        /**
         * @name carousel
         * @module ngX.components
         */
        var carousel = (function () {
            function carousel($attrs, $compile, $element, $http, $interval, $location, $q, $scope, $timeout, $transclude, carouselConfig, debounce, getFromUrlSync, getX, translateX, translateXAsync) {
                var _this = this;
                this.$attrs = $attrs;
                this.$compile = $compile;
                this.$element = $element;
                this.$http = $http;
                this.$interval = $interval;
                this.$location = $location;
                this.$q = $q;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$transclude = $transclude;
                this.carouselConfig = carouselConfig;
                this.debounce = debounce;
                this.getFromUrlSync = getFromUrlSync;
                this.getX = getX;
                this.translateX = translateX;
                this.translateXAsync = translateXAsync;
                this.onInit = function () {
                    _this.$element.find(".view-port").css("width", _this.$element.width());
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < _this.items.length; i++) {
                        var childScope = _this.$scope.$new(true);
                        childScope[_this.$attrs["carouselForName"] || "carouselItem"] = _this.items[i];
                        childScope.width = _this.width;
                        childScope.height = _this.height;
                        childScope.$$index = i;
                        childScope.$$isFirst = (i === 0);
                        childScope.$$isLast = (i === _this.items.length - 1);
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        itemContent.addClass("slide");
                        fragment.appendChild(itemContent[0]);
                    }
                    _this.containerNavtiveElement.appendChild(fragment);
                    setTimeout(function () {
                        _this.currentIndex = 0;
                        _this.setCurrentCssClass();
                        _this.turnOffTransitions();
                        for (var i = 0; i < _this.slideNavtiveElements.length; i++) {
                            _this.slideNavtiveElements[i].classList.add('notransition');
                            _this.translateX(_this.slideNavtiveElements[i], _this.startIndex);
                            _this.slideNavtiveElements[i].classList.remove('notransition');
                        }
                        for (var i = 1; i <= _this.buffer; i++) {
                            var desiredX = -1 * (Number(_this.width) * i);
                            var delta = desiredX - ((_this.items.length - i) * Number(_this.width));
                            _this.rendererdNodes[_this.items.length - 1].node.classList.add('notransition');
                            _this.translateX(_this.rendererdNodes[_this.items.length - 1].node, delta + _this.startIndex);
                            _this.rendererdNodes[_this.items.length - 1].node.classList.remove('notransition');
                            _this.isAnimating = false;
                        }
                        setTimeout(function () { _this.turnOnTransitions(); });
                    }, 300);
                };
                this.setCurrentCssClass = function () {
                    _this.slideNavtiveElements[_this.currentIndex].classList.add("current");
                };
                this.onPreviousAsyncDebounce = function () { _this.debounce(_this.onPreviousAsync, 100)(); };
                this.onPreviousAsync = function () {
                    _this.slideNavtiveElements[_this.currentIndex].classList.remove("current");
                    if (!_this.isAnimating && !_this.inTransition) {
                        if (_this.currentIndex == 0) {
                            _this.currentIndex = _this.items.length - 1;
                        }
                        else {
                            _this.currentIndex = _this.currentIndex - 1;
                        }
                        _this.setCurrentCssClass();
                    }
                    return _this.move({ x: (Number(_this.width)) }).then(function () {
                        _this.turnOffTransitions();
                        var desiredX = -1 * (Number(_this.width) * _this.buffer);
                        var delta = desiredX - _this.rendererdNodes[_this.items.length - 1].offsetLeft;
                        _this.rendererdNodes[0].node.classList.add('notransition');
                        _this.translateX(_this.rendererdNodes[_this.items.length - 1].node, delta + _this.startIndex);
                        _this.isAnimating = false;
                        setTimeout(function () {
                            _this.rendererdNodes[0].node.classList.remove('notransition');
                            _this.turnOnTransitions();
                        });
                    });
                };
                this.onNextAsyncDebounce = function () { _this.debounce(_this.onNextAsync, 100)(); };
                this.onNextAsync = function () {
                    _this.slideNavtiveElements[_this.currentIndex].classList.remove("current");
                    if (!_this.isAnimating && !_this.inTransition) {
                        if (_this.currentIndex == _this.items.length - 1) {
                            _this.currentIndex = 0;
                        }
                        else {
                            _this.currentIndex = _this.currentIndex + 1;
                        }
                        _this.setCurrentCssClass();
                    }
                    return _this.move({ x: (-1) * (Number(_this.width)) }).then(function () {
                        _this.turnOffTransitions();
                        var desiredX = (_this.items.length - 1 - _this.buffer) * Number(_this.width);
                        var delta = desiredX - _this.rendererdNodes[0].offsetLeft;
                        var display = _this.rendererdNodes[0].node.style.display;
                        _this.rendererdNodes[0].node.classList.add('notransition');
                        _this.translateX(_this.rendererdNodes[0].node, delta + _this.startIndex);
                        _this.isAnimating = false;
                        setTimeout(function () {
                            _this.rendererdNodes[0].node.classList.remove('notransition');
                            _this.turnOnTransitions();
                        });
                    });
                };
                this.move = function (options) {
                    var deferred = _this.$q.defer();
                    if (!_this.isAnimating && !_this.inTransition) {
                        var promises = [];
                        _this.isAnimating = true;
                        if (options.x < 0) {
                            for (var i = _this.slideNavtiveElements.length - 1; i > -1; i--) {
                                promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) + options.x) }));
                            }
                        }
                        if (options.x >= 0) {
                            for (var i = 0; i < _this.slideNavtiveElements.length; i++) {
                                promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) + options.x) }));
                            }
                        }
                        _this.$q.all(promises).then(function () {
                            _this.isAnimating = false;
                            deferred.resolve();
                        });
                    }
                    else {
                        deferred.reject();
                    }
                    return deferred.promise;
                };
                this.dispose = function () {
                    angular.element(_this.containerNavtiveElement).find(".slide").remove();
                    _this.containerNavtiveElement.innerHTML = "";
                    _this.$element[0].innerHTML = null;
                    _this.$element = null;
                    _this.$attrs = null;
                    _this.clone = null;
                    delete _this.$element;
                    delete _this.clone;
                };
                this.turnOffTransitions = function () { _this.$element.addClass("notransition"); };
                this._currentIndex = -1;
                this._template = null;
            }
            Object.defineProperty(carousel.prototype, "startIndex", {
                get: function () {
                    return this.carouselConfig.default.startIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(carousel.prototype, "buffer", {
                get: function () { return this.carouselConfig.default.buffer; },
                enumerable: true,
                configurable: true
            });
            carousel.prototype.atBegining = function () { return this.currentIndex == 0; };
            carousel.prototype.atEnd = function () { return this.currentIndex == this.items.length - 1; };
            carousel.prototype.turnOnTransitions = function () { this.$element.removeClass("notransition"); };
            Object.defineProperty(carousel.prototype, "slideNavtiveElements", {
                get: function () { return this.containerNavtiveElement.children; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(carousel.prototype, "currentIndex", {
                get: function () { return this._currentIndex; },
                set: function (value) {
                    this._currentIndex = value;
                    this.$scope.$emit("componentUpdate", { scope: this.$scope });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(carousel.prototype, "template", {
                get: function () {
                    if (this._template != null)
                        return this._template;
                    if (this.$attrs["contentUrl"]) {
                        this._template = this.getFromUrlSync({ url: this.$attrs["contentUrl"] });
                    }
                    else {
                        this._template = this.clone.find("content")[0].innerHTML;
                    }
                    return this._template;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(carousel.prototype, "containerNavtiveElement", {
                get: function () { return this.$element.find(".container")[0]; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(carousel.prototype, "rendererdNodes", {
                get: function () {
                    var renderedNodes = [];
                    for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                        var x = this.getX(this.slideNavtiveElements[i]);
                        var offsetLeft = this.slideNavtiveElements[i].offsetLeft;
                        var left = x + offsetLeft;
                        var node = this.slideNavtiveElements[i];
                        renderedNodes.push({
                            x: x,
                            offsetLeft: offsetLeft,
                            left: left,
                            node: node
                        });
                    }
                    return renderedNodes.sort(function (a, b) {
                        return a.left - b.left;
                    });
                },
                enumerable: true,
                configurable: true
            });
            return carousel;
        })();
        components.carousel = carousel;
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
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=carousel.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        ngX.Component({
            module: "ngX.components",
            selector: "ng-x-footer",
            styles: [
                ".ng-x-footer {",
                "font-family: Arial;",
                "background-color: #212121; color: #ccc; padding: 10px; height: 50px;",
                "}"
            ].join(" \n "),
            template: "<div class='ng-x-footer'></div>"
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=footer.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        ngX.Component({
            module: "ngX.components",
            selector: "hamburger-button",
            styles: [
                ".ng-x-footer {",
                "font-family: Arial;",
                "background-color: #212121; color: #ccc; padding: 10px; height: 50px;",
                "}"
            ].join(" \n "),
            template: "<div class='hamburger-button'></div>"
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=hamburgerButton.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        ngX.Component({
            module: "ngX.components",
            selector: "ng-x-header",
            styles: [
                ".ng-x-header {",
                "font-family: Arial;",
                "background-color: #212121; color: #ccc; padding: 10px; height: 50px;",
                "}"
            ].join(" \n "),
            template: "<div class='ng-x-header'></div>"
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=header.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        /**
         * @name ListDetail
         * @module ngX.components
         * @description reposibile for layout of list detail view and toggling the focus in mobile, possibly using queryStrings
         */
        var ListDetail = (function () {
            function ListDetail($compile, $element, $location, $scope, $transclude, fire) {
                var _this = this;
                this.$compile = $compile;
                this.$element = $element;
                this.$location = $location;
                this.$scope = $scope;
                this.$transclude = $transclude;
                this.fire = fire;
                this.onInit = function () {
                    setTimeout(function () {
                        _this.fire(document, "toggleListDetail", {});
                    }, 3000);
                    document.addEventListener("toggleListDetail", _this.onToggleListDetail);
                    _this.$transclude(_this.$scope.$new(), function (clone) {
                        for (var i = 0; i < clone.length; i++) {
                            if (clone[i].tagName && clone[i].tagName.toUpperCase() === "LIST")
                                _this.listTemplate = "<div class='list-container'>" + clone[i].innerHTML + "<div>";
                            if (clone[i].tagName && clone[i].tagName.toUpperCase() === "DETAIL")
                                _this.detailTemplate = "<div class='detail-container'>" + clone[i].innerHTML + "</div>";
                        }
                    });
                    var listContent = _this.$compile(angular.element(_this.listTemplate))(_this.$scope.$new());
                    _this.$element[0].children[0].appendChild(listContent[0]);
                    var detailContent = _this.$compile(angular.element(_this.detailTemplate))(_this.$scope.$new());
                    _this.$element[0].children[1].appendChild(detailContent[0]);
                };
                this.onToggleListDetail = function () {
                    var s = _this.$location.search();
                    _this.$location.search("detailMode", null);
                };
            }
            return ListDetail;
        })();
        ngX.Component({
            module: "ngX.components",
            styles: [
                ".list-detail { width: 100%; }",
                ".list-detail .list { width: 50%; position: relative; float:left; }",
                ".list-detail .detail { width: 50%; position: relative; float:right }",
                ".clear { clear: both; }"
            ].join(" \n "),
            selector: "list-detail",
            component: ListDetail,
            transclude: true,
            providers: [
                "$compile",
                "$element",
                "$location",
                "$scope",
                "$transclude",
                "fire"
            ],
            template: [
                "<div class='list-detail'>",
                "<div class='list'></div>",
                "<div class='detail'></div>",
                "<div class='clear'></div>",
                "</div>"
            ].join(" ")
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=listDetail.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        function LoginFormComponent() {
            var self = this;
            return self;
        }
        ngX.Component({
            module: "ngX.components",
            selector: "ng-x-login-form",
            component: LoginFormComponent,
            delegates: ["tryToLogin"],
            styles: [
                ".ng-x-login-form { ",
                " }"
            ].join(" \n "),
            template: [
                "<div>",
                "<form name'loginForm'>",
                "<div class='form-control'>",
                "<a class='label'>Username:</a>",
                "<input type='text'></input>",
                "</div>",
                "<div class='form-control'>",
                "<a class='label'>Password:</a>",
                "<input type='passwor'></input>",
                "</div>",
                "<div>",
                "<input type='submit' value='login'></input>",
                "</div>",
                "</form>",
                "</div>"
            ].join(" ")
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=loginForm.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        /**
         * @name Rotator
         * @module ngX.components
         */
        var Rotator = (function () {
            function Rotator($attrs, $compile, $element, $http, $interval, $location, $q, $scope, $timeout, $transclude, debounce, getFromUrlSync, getX, translateX, translateXAsync) {
                var _this = this;
                this.$attrs = $attrs;
                this.$compile = $compile;
                this.$element = $element;
                this.$http = $http;
                this.$interval = $interval;
                this.$location = $location;
                this.$q = $q;
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.$transclude = $transclude;
                this.debounce = debounce;
                this.getFromUrlSync = getFromUrlSync;
                this.getX = getX;
                this.translateX = translateX;
                this.translateXAsync = translateXAsync;
                this.onInit = function () {
                    _this.$element.find(".view-port").css("width", _this.width);
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < _this.items.length; i++) {
                        var childScope = _this.$scope.$new(true);
                        childScope[_this.$attrs["rotatorForName"] || "rotatorItem"] = _this.items[i];
                        childScope.width = _this.width;
                        childScope.height = _this.height;
                        childScope.$$index = i;
                        childScope.$$isFirst = (i === 0);
                        childScope.$$isLast = (i === _this.items.length - 1);
                        var itemContent = _this.$compile(angular.element(_this.template))(childScope);
                        itemContent.addClass("slide");
                        fragment.appendChild(itemContent[0]);
                    }
                    _this.containerNavtiveElement.appendChild(fragment);
                    _this.turnOffTransitions();
                    if (_this.queryStringParam && _this.queryStringParamIndex != 0) {
                        for (var i = _this.slideNavtiveElements.length - 1; i >= 0; i--) {
                            var initialMoveX = (-1) * (_this.queryStringParamIndex * (Number(_this.width)));
                            if (i < _this.queryStringParamIndex - _this.buffer) {
                                _this.translateX(_this.slideNavtiveElements[i], initialMoveX + Number(_this.width) * _this.items.length);
                            }
                            else {
                                _this.translateX(_this.slideNavtiveElements[i], initialMoveX);
                            }
                        }
                        _this.currentIndex = _this.queryStringParamIndex;
                    }
                    else {
                        _this.currentIndex = 0;
                        var desiredX = Number(_this.width) * (-1);
                        var delta = desiredX - ((_this.items.length - 1) * Number(_this.width));
                        _this.translateX(_this.rendererdNodes[_this.items.length - 1].node, delta);
                        _this.isAnimating = false;
                    }
                    setTimeout(function () { _this.turnOnTransitions(); });
                };
                this.onKeyDown = function (event) {
                    switch (event.keyCode) {
                        case 37:
                            _this.onPreviousAsyncDebounce();
                            break;
                        case 39:
                            _this.onNextAsyncDebounce();
                            break;
                    }
                };
                this.onLocationChangeSuccess = function () {
                    if (_this.currentIndex != -1
                        && _this.items[_this.currentIndex][_this.$attrs["querySearchField"] || 'id'] != _this.queryStringParam
                        && _this.queryStringParamIndex != _this.currentIndex) {
                        //TO DO: Turn off transitions for manual manipulation of location bar
                        if (_this.currentIndex === _this.items.length - 1 && _this.queryStringParamIndex === 0)
                            return _this.onNextAsync();
                        if (_this.currentIndex === 0 && _this.queryStringParamIndex === _this.items.length - 1)
                            return _this.onPreviousAsync();
                        if ((_this.currentIndex - _this.queryStringParamIndex) < 0) {
                            return _this.onNextAsync();
                        }
                        else {
                            return _this.onPreviousAsync();
                        }
                    }
                };
                this.onPreviousAsyncDebounce = function () { _this.debounce(_this.onPreviousAsync, 100)(); };
                this.onPreviousAsync = function () {
                    return _this.move({ x: (Number(_this.width)) }).then(function () {
                        _this.turnOffTransitions();
                        var desiredX = Number(_this.width) * (-1);
                        var delta = desiredX - _this.rendererdNodes[_this.items.length - 1].offsetLeft;
                        _this.translateX(_this.rendererdNodes[_this.items.length - 1].node, delta);
                        _this.inTransition = true;
                        _this.currentIndex = (_this.currentIndex === 0) ? _this.items.length - 1 : _this.currentIndex - 1;
                        setTimeout(function () {
                            _this.turnOnTransitions();
                            _this.inTransition = false;
                        }, 300);
                    });
                };
                this.onNextAsyncDebounce = function () { _this.debounce(_this.onNextAsync, 100)(); };
                this.onNextAsync = function () {
                    return _this.move({ x: (-1) * (Number(_this.width)) }).then(function () {
                        _this.turnOffTransitions();
                        var desiredX = Number(_this.width) * (_this.items.length - 2);
                        var delta = desiredX - _this.rendererdNodes[0].offsetLeft;
                        _this.translateX(_this.rendererdNodes[0].node, delta);
                        _this.inTransition = true;
                        _this.currentIndex = (_this.currentIndex === _this.items.length - 1) ? 0 : _this.currentIndex + 1;
                        setTimeout(function () {
                            _this.turnOnTransitions();
                            _this.inTransition = false;
                        }, 300);
                    });
                };
                this.move = function (options) {
                    var deferred = _this.$q.defer();
                    if (!_this.isAnimating && !_this.inTransition) {
                        var promises = [];
                        _this.isAnimating = true;
                        if (options.x < 0) {
                            for (var i = _this.slideNavtiveElements.length - 1; i > -1; i--) {
                                promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) + options.x) }));
                            }
                        }
                        if (options.x >= 0) {
                            for (var i = 0; i < _this.slideNavtiveElements.length; i++) {
                                promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) + options.x) }));
                            }
                        }
                        _this.$q.all(promises).then(function () {
                            _this.isAnimating = false;
                            deferred.resolve();
                        });
                    }
                    else {
                        deferred.reject();
                    }
                    return deferred.promise;
                };
                this.dispose = function () {
                    angular.element(_this.containerNavtiveElement).find(".slide").remove();
                    _this.containerNavtiveElement.innerHTML = "";
                    _this.$element[0].innerHTML = null;
                    _this.$element = null;
                    _this.$attrs = null;
                    _this.clone = null;
                    delete _this.$element;
                    delete _this.clone;
                };
                this.turnOffTransitions = function () { _this.$element.addClass("notransition"); };
                this._currentIndex = -1;
                this._template = null;
            }
            Object.defineProperty(Rotator.prototype, "buffer", {
                get: function () { return 1; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "queryStringParam", {
                get: function () { return this.$location.search()[this.$attrs["querySearchField"] || 'id']; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "queryStringParamIndex", {
                get: function () {
                    var value = -1;
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i][this.$attrs["querySearchField"] || 'id'] == this.queryStringParam) {
                            value = i;
                        }
                    }
                    return value;
                },
                enumerable: true,
                configurable: true
            });
            Rotator.prototype.atBegining = function () { return this.currentIndex == 0; };
            Rotator.prototype.atEnd = function () { return this.currentIndex == this.items.length - 1; };
            Rotator.prototype.turnOnTransitions = function () { this.$element.removeClass("notransition"); };
            Object.defineProperty(Rotator.prototype, "slideNavtiveElements", {
                get: function () { return this.containerNavtiveElement.children; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "currentIndex", {
                get: function () { return this._currentIndex; },
                set: function (value) {
                    this._currentIndex = value;
                    this.$scope.$emit("componentUpdate", { scope: this.$scope });
                    var url = this.items[this.currentIndex][this.$attrs["querySearchField"] || 'id'];
                    this.$location.search(this.$attrs["querySearchField"] || 'id', url);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "template", {
                get: function () {
                    if (this._template != null)
                        return this._template;
                    if (this.$attrs["contentUrl"]) {
                        this._template = this.getFromUrlSync({ url: this.$attrs["contentUrl"] });
                    }
                    else {
                        this._template = this.clone.find("content")[0].innerHTML;
                    }
                    return this._template;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "containerNavtiveElement", {
                get: function () { return this.$element.find(".container")[0]; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "rendererdNodes", {
                get: function () {
                    var renderedNodes = [];
                    for (var i = 0; i < this.slideNavtiveElements.length; i++) {
                        var x = this.getX(this.slideNavtiveElements[i]);
                        var offsetLeft = this.slideNavtiveElements[i].offsetLeft;
                        var left = x + offsetLeft;
                        var node = this.slideNavtiveElements[i];
                        renderedNodes.push({
                            x: x,
                            offsetLeft: offsetLeft,
                            left: left,
                            node: node
                        });
                    }
                    return renderedNodes.sort(function (a, b) {
                        return a.left - b.left;
                    });
                },
                enumerable: true,
                configurable: true
            });
            return Rotator;
        })();
        components.Rotator = Rotator;
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
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=rotator.js.map



//# sourceMappingURL=scrollHeader.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        ngX.Component({
            module: "ngX.components",
            selector: "social-media-meta-tag",
            template: [
                "<!-- Update your html tag to include the itemscope and itemtype attributes. --> ",
                "<html itemscope itemtype='http://schema.org/Article'> ",
                " ",
                "<!-- Place this data between the <head> tags of your website --> ",
                "<title>Page Title. Maximum length 60-70 characters</title> ",
                "<meta name='description' content='Page description. No longer than 155 characters.' /> ",
                " ",
                "<!-- Schema.org markup for Google+ --> ",
                "<meta itemprop='name' content='The Name or Title Here'> ",
                "<meta itemprop='description' content='This is the page description'> ",
                "<meta itemprop='image' content='http://www.example.com/image.jpg'> ",
                " ",
                "<!-- Twitter Card data --> ",
                "<meta name='twitter:card' content='summary_large_image'> ",
                "<meta name='twitter:site' content='@publisher_handle'> ",
                "<meta name='twitter:title' content='Page Title'> ",
                "<meta name='twitter:description' content='Page description less than 200 characters'> ",
                "<meta name='twitter:creator' content='@author_handle'> ",
                "<!-- Twitter summary card with large image must be at least 280x150px --> ",
                "<meta name='twitter:image:src' content='http://www.example.com/image.html'> ",
                " ",
                "<!-- Open Graph data --> ",
                "<meta property='og:title' content='Title Here' /> ",
                "<meta property='og:type' content='article' /> ",
                "<meta property='og:url' content='http://www.example.com/' /> ",
                "<meta property='og:image' content='http://example.com/image.jpg' /> ",
                "<meta property='og:description' content='Description Here' /> ",
                "<meta property='og:site_name' content='Site Name, i.e. Moz' /> ",
                "<meta property='article:published_time' content='2013-09-17T05:59:00+01:00' /> ",
                "<meta property='article:modified_time' content='2013-09-16T19:08:47+01:00' /> ",
                "<meta property='article:section' content='Article Section' /> ",
                "<meta property='article:tag' content='Article Tag' /> ",
                "<meta property='fb:admins' content='Facebook numberic ID' /> "
            ].join(" ")
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=socialMediaMetaTag.js.map



//# sourceMappingURL=tabs.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        var Vimeo = (function () {
            function Vimeo($element, $http) {
                var _this = this;
                this.$element = $element;
                this.$http = $http;
                this.onInit = function () {
                    return _this.$http.jsonp(_this.embedUrl, {
                        params: {
                            url: _this.url,
                            callback: 'JSON_CALLBACK',
                            player_id: "1"
                        }
                    }).then(function (response) {
                        _this.$element.html(response.data.html);
                    });
                };
                this.dispose = function () {
                    _this.$element = null;
                };
            }
            Object.defineProperty(Vimeo.prototype, "height", {
                get: function () { return this._height; },
                set: function (value) { this._height = value; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vimeo.prototype, "width", {
                get: function () { return this._width; },
                set: function (value) { this._width = value; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vimeo.prototype, "videoId", {
                get: function () { return this._videoId; },
                set: function (value) { this._videoId = value; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vimeo.prototype, "url", {
                get: function () { return "https://vimeo.com/" + this.videoId; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Vimeo.prototype, "embedUrl", {
                get: function () { return 'https://www.vimeo.com/api/oembed.json'; },
                enumerable: true,
                configurable: true
            });
            return Vimeo;
        })();
        ngX.Component({
            module: "ngX.components",
            selector: "vimeo",
            component: Vimeo,
            inputs: ["height", "width", "videoId"],
            providers: ["$element", "$http"],
            styles: [".vimeo { }"].join(" /n "),
            template: ["<div></div>"].join(" ")
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=vimeo.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        /**
        * @name VirtualFor
        * @module ngX.components
        */
        var VirtualForAttribute = (function () {
            function VirtualForAttribute($attrs, $compile, $element, $interval, getY, safeDigest, transformY) {
                this.$attrs = $attrs;
                this.$compile = $compile;
                this.$element = $element;
                this.$interval = $interval;
                this.getY = getY;
                this.safeDigest = safeDigest;
                this.transformY = transformY;
                this.onInit = function () {
                };
                this.dispose = function () {
                };
                this.render = function () {
                };
                this.scrollTo = function () {
                };
                this.initialRender = function () {
                };
                this.renderTopToBottom = function () {
                };
                this.renderBottomToTop = function () {
                };
                this.removeItem = function () {
                };
                this.moveAndUpdateScope = function () {
                };
                this.onResize = function () {
                };
                this.calculateItemHeight = function () {
                };
            }
            return VirtualForAttribute;
        })();
        ngX.Component({
            module: "ngX.components",
            selector: "virtual-for",
            component: VirtualForAttribute,
            providers: ["$attrs", "$compile", "$element", "$interval", "getY", "safeDigest", "transformY"]
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=virtualFor.js.map

var ngX;
(function (ngX) {
    var components;
    (function (components) {
        var Youtube = (function () {
            function Youtube($element, $scope, $window, guid) {
                var _this = this;
                this.$element = $element;
                this.$scope = $scope;
                this.$window = $window;
                this.guid = guid;
                this.onInit = function () {
                    var scriptTag = document.getElementById("youtube-player");
                    if (!scriptTag) {
                        _this.insertYoutubeScriptTag();
                    }
                    if (scriptTag && !_this.$window.YT) {
                        setTimeout(_this.onYouTubeIFrameApiReady, 300);
                    }
                    else if (scriptTag) {
                        _this.onYouTubeIFrameApiReady();
                    }
                    else {
                        _this.$window.onYouTubeIframeAPIReady = _this.onYouTubeIFrameApiReady;
                    }
                };
                this.insertYoutubeScriptTag = function () {
                    var tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.setAttribute("id", "youtube-player");
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                };
                this.onYouTubeIFrameApiReady = function () {
                    _this.player = new YT.Player(_this.$element[0], {
                        playerVars: {
                            autoplay: 0,
                            theme: "light",
                            color: "white",
                            iv_load_policy: 3,
                            showinfo: 1,
                            controls: 1
                        },
                        height: _this.height,
                        width: _this.width,
                        videoId: _this.videoId,
                    });
                };
                this.dispose = function () {
                    _this.player.destroy();
                    _this.$element = null;
                };
            }
            Object.defineProperty(Youtube.prototype, "height", {
                get: function () { return this._height; },
                set: function (value) {
                    if (value && this._height && value != this._height)
                        this.player.setSize(this.width, this.height);
                    this._height = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Youtube.prototype, "width", {
                get: function () { return this._width; },
                set: function (value) {
                    if (value && this._width && value != this._width)
                        this.player.setSize(this.width, this.height);
                    this._width = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Youtube.prototype, "videoId", {
                get: function () { return this._videoId; },
                set: function (value) {
                    if (value && this._videoId && value != this._videoId)
                        this.player.cueVideoById(value);
                    this._videoId = value;
                },
                enumerable: true,
                configurable: true
            });
            return Youtube;
        })();
        ngX.Component({
            module: "ngX.components",
            selector: "youtube",
            component: Youtube,
            inputs: ["height", "width", "videoId"],
            providers: ["$element", "$scope", "$window", "guid"],
            styles: [".youtube { }"].join(" /n "),
            template: ["<div class='youtube'></div>"].join(" ")
        });
        angular.module("ngX.components").filter("youtubeThumbnail", [function () {
                return function (videoId) { return "http://img.youtube.com/vi/" + videoId + "/0.jpg"; };
            }]);
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=youtube.js.map
