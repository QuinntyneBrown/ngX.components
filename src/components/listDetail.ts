module ngX.components {
    
    /**
     * @name ListDetail
     * @module ngX.components
     * @description reposibile for layout of list detail view and toggling the focus in mobile, possibly using queryStrings
     */
    class ListDetail {
        constructor(private $compile: ng.ICompileService, private $element: any, private $location: any,
            private $scope: ng.IScope, private $transclude: Function,
            private fire:any
        ) {

        }

        public onInit = () => {

            setTimeout(() => {
                this.fire(document, "toggleListDetail", {});
            }, 3000);

            document.addEventListener("toggleListDetail", this.onToggleListDetail);

            this.$transclude(this.$scope.$new(), (clone:any) => {
                for (var i = 0; i < clone.length; i++) {
                    if (clone[i].tagName && clone[i].tagName.toUpperCase() === "LIST")
                        this.listTemplate = "<div class='list-container'>" + clone[i].innerHTML + "<div>";

                    if (clone[i].tagName && clone[i].tagName.toUpperCase() === "DETAIL")
                        this.detailTemplate = "<div class='detail-container'>" + clone[i].innerHTML + "</div>";
                }
            });
            
            var listContent = this.$compile(angular.element(this.listTemplate))(this.$scope.$new());
            this.$element[0].children[0].appendChild(listContent[0]);

            var detailContent = this.$compile(angular.element(this.detailTemplate))(this.$scope.$new());
            this.$element[0].children[1].appendChild(detailContent[0]);

        }

        public onToggleListDetail = () => {
            var s = this.$location.search();
            this.$location.search("detailMode", null);
        }

        public listTemplate: string;

        public detailTemplate: string;
    }

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
} 