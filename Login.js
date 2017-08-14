/***
 * Handles User Auth
 */
class Auth {
    /***
     * Constructor
     * @param parentRef: reference to parent class instance, in order to inform about login status
     * @param pryvSettings: settings for pryv database connection
     */
    constructor(parentRef, pryvSettings) {
        this.pryvSettings = pryvSettings;
        this.parentRef = parentRef;
        this.pryvUserConnection = null;
        this.pryvLoginSettings = {
            requestingAppId: pryvSettings.appId,
            requestedPermissions: pryvSettings.requestedPermissions,
            spanButtonID: pryvSettings.spanButtonId,
            callbacks: {
                initialization: function () {
                    // ...
                },
                needSignin: function (popupUrl, pollUrl, pollRateMs) {
                    $(".modal-login").modal("show");
                    $(".power").addClass("animated");
                    $(".power").addClass("pulse");
                    $(".power").addClass("infinite");
                },
                signedIn:  (connection) => {
                    this.pryvUserConnection = connection;
                    this.logInSuccessful(connection);
                },
                refused: function (code) {
                    log(code);
                },
                error: function (code, message) {
                    log(message);
                }
            }
        };
    }

    /***
     * Prompts Pryv auth login view
     */
    logIn() {
        pryv.Auth.config.registerURL.host = 'reg.' + this.pryvSettings.domain;
        pryv.Auth.setup(this.pryvLoginSettings);
    }

    logOut() {
        this.pryvUserConnection = null;
        $(".power").removeClass("btn-success");
        $(".power").addClass("btn-warning");
    }
    /***
     * Performs actions after successful user login
     */
    logInSuccessful() {
        $(".power").removeClass("animated");
        $(".power").removeClass("pulse");
        $(".power").removeClass("infinite");
        $(".power").removeClass("btn-warning");
        $(".power").addClass("btn-success");
        this.parentRef.onLoggedIn();
    }
}