module ngX.components {
    
    /**
     * @name ListDetail
     * @module ngX.components
     */
    class ListDetail {
        constructor(private $element: any, private $scope:any,private $transclude: Function) {

        }

        public onInit = () => {
            this.$transclude(this.$scope, (clone:any) => {
                for (var i = 0; i < clone.length; i++) {
                    if (clone[i].tagName && clone[i].tagName.toUpperCase() === "LIST")
                        this.listTemplate = clone[i].innerHTML;

                    if (clone[i].tagName && clone[i].tagName.toUpperCase() === "DETAIL")
                        this.detailTemplate = clone[i].innerHTML;
                }
            });
        }

        public listTemplate: string;

        public detailTemplate: string;
    }

    ngX.Component({
        module: "ngX.components",
        styles: [
            ".list-detail { width: 100%; }"
        ].join(" /n "),
        selector: "list-detail",
        component: ListDetail,
        transclude: true,
        providers: [
            "$element",
            "$scope",
            "$transclude"
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