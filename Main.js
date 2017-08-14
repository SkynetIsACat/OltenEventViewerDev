
/*
    DEBUG functionality
 */
const DEBUG = true;

/***
 * Used to log debugging information to console.
 *
 * @param {Object} arg: object to be logged.
 * @param {String} TAG: {String} text describing the context e.g. invokers class name
 */
function log(arg, TAG="") {
    if (DEBUG) {
        console.log(TAG + ":", arg);
    }
}

// TODO: export declaration to config file
/***
 * Settings for pryv database connection
 * @type {{domain: string, requestedPermissions: [null], appId: string, spanButtonId: string}}
 */
const PRYV_SETTINGS = {
    domain: 'domocare.io',
    requestedPermissions: [{
        streamId: 'questionnaire',
        defaultName: 'Questions',
        level: 'contribute'
    }],
    appId: 'Questionnaires',
    spanButtonId: 'pryv-button',
};

/***
 * Pryv streamIds, defining from which streams to pull events
 *
 * @type {[string,string,string]}
 */
const STREAMS = ["LaSourceHabitsEnvironment", "InselQuestionnaires", "NOMAD_GeneralHealth"];

/***
 * Application Entry Point
 */
class Main {
    /***
     * Constructor
     * @param pryvSettings: settings for pryv database connection
     */
    constructor(pryvSettings) {
        this.login = new Auth(this, pryvSettings);
        this.controller = null;
    }

    init() {
        this.login.logIn();
    }

    /***
     * Performs actions after successful login
     */
    onLoggedIn() {
        this.controller = new MainController(this.login.pryvUserConnection, "event-view", "category-events");
        this.controller.init();
    }

    /***
     * Performs clean up after logOut
     */
    onLogOut() {
        this.controller.remove();
        this.controller = null;
        this.login.logOut();
    }

}


const main = new Main(PRYV_SETTINGS);
main.init();