module ngX.components {


    function LoginFormComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        module: "ngX.components",
        selector: "ng-x-login-form",
        component: LoginFormComponent,
        delegates:["tryToLogin"],
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

}
