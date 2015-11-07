module ngX.components {
    
    /**
     * @name Rotator
     */
    export class Rotator {
        constructor() {
            
        }
    }

    ngX.Component({
        module:"ngX.components",
        selector: "rotator",
        component: Rotator,
        template: [
            "<div class='rotator'>",
            "</div>"
        ].join(" ")
    });
}