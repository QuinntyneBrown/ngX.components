 module ngX.components {
     
     class Youtube {
         constructor(private $element: ng.IAugmentedJQuery, private $scope:ng.IScope, private $window:ng.IWindowService) { }

         public onInit = () => {
             this.insertYoutubeScriptTag();
             (<any>this.$window).onYouTubeIframeAPIReady = this.onYouTubeIFrameApiReady;
         }

         public insertYoutubeScriptTag = () => {
             var tag = document.createElement('script');
             tag.src = "https://www.youtube.com/iframe_api";
             var firstScriptTag = document.getElementsByTagName('script')[0];
             firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
         }

         public onYouTubeIFrameApiReady = () => {                       
             this.player = new YT.Player((<any>this.$element[0]), {
                 playerVars: {
                     autoplay: 0,
                     theme: "light",
                     color: "white",
                     iv_load_policy: 3,
                     showinfo: 1,
                     controls: 1
                 },
                 height: this.height,
                 width: this.width,
                 videoId: this.videoId,
             });
         }

         public player: any;

         private _height: string;

         public get height() { return this._height; }

         public set height(value: string) {
             if (value && this._height && value != this._height)
                 this.player.setSize(this.width, this.height);

             this._height = value;
         }

         private _width: string;

         public get width() { return this._width; }

         public set width(value: string) {
             if (value && this._width && value != this._width)
                 this.player.setSize(this.width, this.height);

             this._width = value;
         }

         private _videoId: string;

         public get videoId() { return this._videoId; }

         public set videoId(value: string) {
             if (value && this._videoId && value != this._videoId)
                 this.player.cueVideoById(value);

             this._videoId = value;
         }

     }

     ngX.Component({
         module:"ngX.components",
         selector: "youtube",
         component: Youtube,
         inputs:["height","width","videoId"],
         providers: ["$element","$scope","$window"],
         styles: [".youtube { }"].join(" /n "),
         template: ["<div class='youtube'></div>"].join(" ")
     });
 }