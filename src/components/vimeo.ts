module ngX.components {

    class Vimeo {
        constructor(private $element: ng.IAugmentedJQuery,
            private $http:ng.IHttpService) { }

        public onInit = () => {

            return this.$http.jsonp(this.embedUrl, {
                params: {
                    url: this.url,
                    callback: 'JSON_CALLBACK',
                    player_id: "1"
                }
            }).then((response: any) => {
                this.$element.html(response.data.html);
            });
        }

        private _height: string;

        public get height() { return this._height; }

        public set height(value: string) { this._height = value; }

        private _width: string;

        public get width() { return this._width; }

        public set width(value: string) { this._width = value; }

        private _videoId: string;

        public get videoId() { return this._videoId; }

        public set videoId(value: string) { this._videoId = value; }
        
        public get url() { return "https://vimeo.com/" + this.videoId; }

        public get embedUrl() { return 'https://www.vimeo.com/api/oembed.json'; }

        private dispose = () => {
            this.$element = null;
        }
    }

    ngX.Component({
        module: "ngX.components",
        selector: "vimeo",
        component: Vimeo,
        inputs: ["height", "width", "videoId"],
        providers: ["$element", "$http"],
        styles: [".vimeo { }"].join(" /n "),
        template: ["<div></div>"].join(" ")
    });
}