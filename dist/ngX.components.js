//angular.module("ngX.components", ["ngX"]);

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
        /**
         * @name Rotator
         * @
         */
        var Rotator = (function () {
            function Rotator($attrs, $compile, $element, $http, $interval, $q, $scope, $timeout, $transclude, getHtml, getX, translateX, translateXAsync) {
                var _this = this;
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
                this.onInit = function () {
                    _this.$transclude(_this.$scope, function (clone) {
                        _this.clone = clone;
                        var fragment = document.createDocumentFragment();
                        var template = _this.getHtml(_this.clone[0].children[0], true);
                        for (var i = 0; i < _this.items.length; i++) {
                            var childScope = _this.$scope.$new(true);
                            childScope[_this.$attrs["rotatorForName"] || "rotatorItem"] = _this.items[i];
                            childScope.$$index = i;
                            childScope.$$isFirst = (i === 0);
                            childScope.$$isLast = (i === _this.items.length - 1);
                            var itemContent = _this.$compile(angular.element(template))(childScope);
                            itemContent.addClass("slide");
                            fragment.appendChild(itemContent[0]);
                        }
                        _this.containerNavtiveElement.appendChild(fragment);
                    });
                };
                this.onNextAsync = function () {
                    var deferred = _this.$q.defer();
                    if (!_this.isAnimating) {
                        var promises = [];
                        _this.isAnimating = true;
                        for (var i = 0; i < _this.slideNavtiveElements.length; i++) {
                            promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: 100 }));
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
                this.onPreviousAsync = function () {
                    var deferred = _this.$q.defer();
                    if (!_this.isAnimating) {
                        var promises = [];
                        _this.isAnimating = true;
                        for (var i = 0; i < _this.slideNavtiveElements.length; i++) {
                            promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: 100 }));
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
            }
            return Rotator;
        })();
        components.Rotator = Rotator;
        ngX.Component({
            module: "ngX.components",
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
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=rotator.js.map



//# sourceMappingURL=virtualFor.js.map
