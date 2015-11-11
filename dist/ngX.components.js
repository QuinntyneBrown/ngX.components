angular.module("ngX.components", ["ngX"]);

//# sourceMappingURL=ngX.components.module.js.map

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
            function Rotator($attrs, $compile, $element, $http, $interval, $location, $q, $scope, $timeout, $transclude, getX, translateX, translateXAsync) {
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
                this.getX = getX;
                this.translateX = translateX;
                this.translateXAsync = translateXAsync;
                this.onInit = function () {
                    _this.$scope.$on("$locationChangeSuccess", function () {
                        if (_this.currentIndex != -1 && _this.items[_this.currentIndex][_this.$attrs["querySearchField"] || 'id'] != _this.queryStringParam) {
                            _this.moveToIndexAsync({ index: _this.queryStringParamIndex });
                        }
                    });
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
                    if (_this.queryStringParam) {
                        for (var i = 0; i < _this.items.length; i++) {
                            if (_this.items[i][_this.$attrs["querySearchField"] || 'id'] == _this.queryStringParam) {
                                _this.updateCurrentIndex({ currentIndex: i });
                                var promises = [];
                                _this.isAnimating = true;
                                _this.turnOffTransitions();
                                for (var h = _this.slideNavtiveElements.length - 1; h > -1; h--) {
                                    promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[h], x: (_this.getX(_this.slideNavtiveElements[h]) - (Number(_this.width) * (i))) }));
                                }
                                var id = setTimeout(function () {
                                    id = null;
                                    _this.isAnimating = false;
                                    _this.turnOnTransitions();
                                }, 0);
                            }
                        }
                    }
                    else {
                        _this.updateCurrentIndex({ currentIndex: 0 });
                    }
                };
                this.onPreviousAsync = function () {
                    var deferred = _this.$q.defer();
                    if (!_this.isAnimating && _this.currentIndex != 0) {
                        var promises = [];
                        _this.isAnimating = true;
                        for (var i = 0; i < _this.slideNavtiveElements.length; i++) {
                            promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) + Number(_this.width)) }));
                        }
                        _this.$q.all(promises).then(function () {
                            /**
                             * move tail to head
                             */
                            _this.updateCurrentIndex({ currentIndex: _this.currentIndex - 1 });
                            _this.isAnimating = false;
                            deferred.resolve();
                        });
                    }
                    else {
                        deferred.reject();
                    }
                    return deferred.promise;
                };
                this.onNextAsync = function () {
                    var deferred = _this.$q.defer();
                    if (!_this.isAnimating && _this.currentIndex != _this.items.length - 1) {
                        var promises = [];
                        _this.isAnimating = true;
                        for (var i = _this.slideNavtiveElements.length - 1; i > -1; i--) {
                            promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) - Number(_this.width)) }));
                        }
                        _this.$q.all(promises).then(function () {
                            /**
                             * move the head to tail
                             */
                            _this.updateCurrentIndex({ currentIndex: _this.currentIndex + 1 });
                            _this.isAnimating = false;
                            deferred.resolve();
                        });
                    }
                    else {
                        deferred.reject();
                    }
                    return deferred.promise;
                };
                this.moveToIndexAsync = function (options) {
                    var deferred = _this.$q.defer();
                    var move = 0;
                    if (Number(_this.currentIndex) > Number(options.index)) {
                        move = (-1) * (Number(_this.width) * (Number(options.index) - Number(_this.currentIndex)));
                    }
                    else {
                        move = (-1) * Number(_this.width) * (Number(options.index) - Number(_this.currentIndex));
                    }
                    if (!_this.isAnimating) {
                        var promises = [];
                        _this.isAnimating = true;
                        for (var i = _this.slideNavtiveElements.length - 1; i > -1; i--) {
                            promises.push(_this.translateXAsync({ element: _this.slideNavtiveElements[i], x: (_this.getX(_this.slideNavtiveElements[i]) + move) }));
                        }
                        _this.$q.all(promises).then(function () {
                            _this.updateCurrentIndex({ currentIndex: options.index });
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
                this.updateCurrentIndex = function (options) {
                    _this.currentIndex = options.currentIndex;
                    _this.$scope.$emit("componentUpdate", { scope: _this.$scope });
                    var url = _this.items[_this.currentIndex][_this.$attrs["querySearchField"] || 'id'];
                    _this.$location.search(_this.$attrs["querySearchField"] || 'id', url);
                };
                this.turnOffTransitions = function () { _this.$element.addClass("notransition"); };
                this.currentIndex = -1;
            }
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
            Object.defineProperty(Rotator.prototype, "template", {
                get: function () { return this.clone.find("slide")[0].innerHTML; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Rotator.prototype, "containerNavtiveElement", {
                get: function () { return this.$element.find(".container")[0]; },
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
                " .rotator .slide { ",
                "   transition: transform 0.5s cubic-bezier(0.1, 0.1, 0.25, 0.9); } ",
                " .rotator.notransition .slide { ",
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
                "getX",
                "translateX",
                "translateXAsync"
            ],
            template: [
                "<div class='rotator'> ",
                "<div class='view-port'>",
                "<div class='container'></div>",
                "<div data-ng-hide='vm.atBegining()' class='previous-arrow' data-ng-click='vm.onPreviousAsync()'>&nbsp;<img src='{{ vm.previousButtonImageUrl }}' /></div>",
                "<div data-ng-hide='vm.atEnd()' class='next-arrow' data-ng-click='vm.onNextAsync()'>&nbsp;<img src='{{ vm.nextButtonImageUrl }}' /></div>",
                "</div>",
                "</div>"
            ].join(" ")
        });
    })(components = ngX.components || (ngX.components = {}));
})(ngX || (ngX = {}));

//# sourceMappingURL=rotator.js.map



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
