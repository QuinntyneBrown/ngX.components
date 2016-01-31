class Modal {
    constructor(private $compile,
        private $location,
        private $q,
        private $rootScope,
        private APP_ACTIONS,
        private appendToBodyAsync,
        private backDrop,
        private dispatcher,
        private extendCssAsync,
        private removeElement,
        private setOpacityAsync) {

        this.dispatcher.addListener({
            actionType: this.APP_ACTIONS.OPEN_MODAL,
            callback: options => this.openAsync({ html: options.html })
        });

        this.dispatcher.addListener({
            actionType: this.APP_ACTIONS.CLOSE_MODAL,
            callback: () => this.closeAsync()
        });

        this.dispatcher.addListener({
            actionType: this.APP_ACTIONS.TOGGLE_PIN_MODAL,
            callback: () => this.togglePin()
        });
    }

    openAsync = options => {
        var openAsyncFn = () => {
            this._html = options.html;
            return this.initializeAsync()
                .then(this.backDrop.openAsync)
                .then(this.appendModalToBodyAsync)
                .then(this.showAsync);
        }
        setTimeout(openAsyncFn, 100);
    }

    initializeAsync = () => {
        var deferred = this.$q.defer();
        this.$scope = this.$rootScope.$new();
        this.compileAsync().then(() => {
            this.nativeElement = this.augmentedJQuery[0];
            this.extendCssAsync({
                nativeHTMLElement: this.nativeElement,
                cssObject: {
                    "opacity": "0",
                    "position": "fixed",
                    "margin-top": "-300px",
                    "top": "0",
                    "left": "0",
                    "background-color": "#FFF",
                    "display": "block",
                    "z-index": "999",
                    "width": "100%",
                    "padding": "30px",
                    "transition": "all 0.5s",
                    "-webkit-transition": "all 0.5s",
                    "-o-transition": "all 0.5s"
                }


            }).then(function () {
                deferred.resolve();
            });

        });
        return deferred.promise;
    }

    compileAsync = () => {
        var deferred = this.$q.defer();
        this.augmentedJQuery = this.$compile(angular.element(this.html))(this.$scope);
        setTimeout(() => {
            this.$scope.$digest()
            deferred.resolve();
        }, 100);
        return deferred.promise;
    }


    appendModalToBodyAsync = () => this.appendToBodyAsync({ nativeElement: this.nativeElement });

    showAsync = () => this.extendCssAsync({
        nativeHTMLElement: this.nativeElement,
        cssObject: {
            "opacity": "100",
            "margin-top": "0px",
        }
    });

    closeAsync = () => {
        if (!this.pinned) {
            var deferred = this.$q.defer();


            try {
                this.extendCssAsync({
                    nativeHTMLElement: this.nativeElement,
                    cssObject: {
                        "opacity": "0",
                    }
                })
                    .then(this.backDrop.closeAsync)
                    .then(() => {
                        this.augmentedJQuery[0].parentNode.removeChild(this.augmentedJQuery[0]);
                        deferred.resolve();
                    });
            } catch (error) {
                deferred.resolve();
            }
            return deferred.promise;
        }
    }

    dispose = () => { }

    get html() { return this._html; }

    togglePin = () => {
        if (this.pinned) {
            this.pinned = false;
            this.closeAsync();
        } else {
            this.pinned = true;
        }
    }
    options;
    $scope;
    augmentedJQuery;
    nativeElement;
    _html;
    pinned = false;
}

angular.module("ngX.components").service("modal", ["$compile", "$location", "$q", "$rootScope", "APP_ACTIONS", "appendToBodyAsync", "backDrop", "dispatcher", "extendCssAsync", "removeElement", "setOpacityAsync", Modal])
    .run(["modal", modal => { }]);
