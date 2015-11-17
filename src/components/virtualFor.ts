module ngX.components {

    /**
    * @name VirtualFor
    * @module ngX.components
    */
    class VirtualForAttribute {

        constructor(
            private $attrs: ng.IAttributes,
            private $compile: ng.ICompileService,
            private $element: ng.IAugmentedJQuery,
            private $interval: ng.IIntervalService,
            private getY: Function,
            private safeDigest: Function,
            private transformY: Function
        ) { }

        public onInit = () => {

        }

        private dispose = () => {
            
        }

        private render = () => {

        }

        private scrollTo = () => {

        }

        private initialRender = () => {

        }

        private renderTopToBottom = () => {

        }

        private renderBottomToTop = () => {

        }

        private removeItem = () => {

        }

        private moveAndUpdateScope = () => {

        }

        private onResize = () => {

        }

        private calculateItemHeight = () => {

        }

        private templateRef: any;

    }

    ngX.Component({
        module: "ngX.components",
        selector: "virtual-for",
        component: VirtualForAttribute,
        providers: ["$attrs","$compile","$element","$interval","getY","safeDigest","transformY"]
    });
}