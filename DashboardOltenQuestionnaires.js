$.material.init(); // init material
var DEBUG = true;
var user_connection;

function log(arg, TAG="") {
    if (DEBUG) {
        console.log(TAG + ":", arg);
    }
}

class LoginController {
    constructor() {
        this.connection;
        this.pryv_variables = {
            pryvDomain: 'domocare.io',
            requestedPermissions: [{
                streamId: 'questionnaire',
                defaultName: 'Questions',
                level: 'contribute'
            }],
            appId: 'Questionnaires',
            spanButtonId: 'pryv-button',
            pryvUtility: null
        };
        this.settings = {
            requestingAppId: this.pryv_variables.appId,
            requestedPermissions: this.pryv_variables.requestedPermissions,
            spanButtonID: this.pryv_variables.spanButtonId,
            callbacks: {
                initialization: function () {
                          // ...
                },
                needSignin: function (popupUrl, pollUrl, pollRateMs) {
                    $(".modal-login").modal("show");
                    $(".power").css("color", "#FF9800");
                },
                signedIn: function (connection) {
                    this.connection = connection;
                    this.logInSuccessful(connection);
                },
                refused: function (code) {
                    console.log(code);
                },
                error: function (code, message) {
                    console.log(message);
                }
            }
        };
    }
    
    //Promots user to sign in
    logIn(callback) {
        this.settings.callbacks.signedIn = (connection) => {
            this.connection = connection;
            this.logInSuccessful(connection, callback);
        }
        pryv.Auth.config.registerURL.host = 'reg.' + this.pryv_variables.pryvDomain;
        pryv.Auth.setup(this.settings);
    }
    
    logInSuccessful(connection, callback) {
        $(".power").css("color", "#009688");
        callback(connection);
    }
    
    logout() {
        this.connection = null;
        $(".modal-login").modal("show");
        // Change view accordingly
    }
}

class MainController {
    constructor(loginController) {
        this.eventManager;
        this.loginController = loginController;
    }
    
    start() {
        this.signIn();
    }
    
    signIn() {
        this.loginController.logIn( (connection) => {
            this.signedIn(connection);
        });
    }
    
    signedIn(connection) {
        if (connection === null) {
            alert("Could not Auth, try again!");
            throw new Error("Connection not established!");
        }
        this.initEventManager(connection);
        this.eventManager.fetchMapping( (mapping) => {
            this.fetchEvents();
        });
    }
    
    initEventManager(connection) {
        let eventRetriever = new EventRetriever();
        let mappingRetriever = new MappingRetriever(connection);
        this.eventManager = new EventManager(eventRetriever, mappingRetriever);
    }
    
    fetchEvents() {
        log("fetchEvents");
    }
    
    
    
}

// TODO: handle errors
class GenericPryvEventRequest {
    constructor() {
        this.listners = [];
    }
    
    addListener(ref) {
        this.listners.push(ref);
    }
    
    sendGetRequest(filter, callback) {
        this.connection.events.get(filter, (err, events) => {
            callback(err, events);
        });
    }
}

class MappingRetriever extends GenericPryvEventRequest {
    
    constructor(connection) {
        super();
        this.connection = connection;
    }
    
    getMapping(callback, _limit=1000) {
        let filter = new pryv.Filter({limit:_limit, streams: ["access-tokens"]})
        this.sendGetRequest(filter, (err, events) => {
            for (let i=0; i < this.listeners.length; i++) {
                this.listeners[i].onMappingReceived( this.extractContent(events) );
            }
            let _mapping = this.extractContents(events);
            this.eventManager.onMappingReceived( events, callback );
        })
    }
    
    extractContent(eventArray) {
        let length = eventArray.length;
        let resultArray = [];
        for (let i=0; i < length; i++) {
            resultArray.push(eventArray[i].content);
        }
        return resultArray;
    }
}

class EventRetriever extends GenericPryvEventRequest {
        
    constructor() {
        super();
        this.TAG = "EventRetriever";
    }
    
    getEventsForAllMapping(allMapping, filter) {
        for (let i=0; i < allMapping.length; i++) {
            let mapping = allMapping[i];
            let tempConnection = new pryv.Connection( {username: mapping.name, auth: mapping.token} );
            this.getEvents(tempConnection, filter);
        }
        this.eventManager.onStoppedReceiving();
    }
    
    getEvents(connection, filter) {
        this.sendGetRequest(filter, (events, err) => {
            for (let i=0; i < this.listeners.length; i++) {
                this.listeners.onEventsReceived(events);
            }
        });
    }
}



class EventManager {
    constructor(eventRetriever, mappingRetriever) {
        this.mappingRetriever = mappingRetriever.addListener(this);
        this.eventRetriever = eventRetriever.addListener(this);
        this.mapping = null;
        this.events = [];
        this.TAG = "EventManager";
        this.pryvFilter = {
            limit: 20,
            streams: ["LaSourceHabitsEnvironment", "InselQuestionnaires", "NOMAD_GeneralHealth"]
        };
    }
    
    setFilter(filter) {
        this.pryvFilter = filter;
    }
    
    getMapping() {
        if (this.mapping === null) {
            throw Error("Null Object Reference error: Mapping not set yet!");
        }
        return this.decodeMapping(this.mapping);
    }
    
    setMapping(mapping) {
        this.mapping = this.encodeMapping(mapping);
    }
    
    fetchMapping(callback) {
        this.mappingRetriever.getMapping(callback);
    }
    
    fetchEvents(mapping) {
        this.eventRetriever.getEventsForAllMapping(mapping, this.filter);
        log("startFetchingRoutine", this.TAG);
    }
    
    encodeMapping(rawMapping) {
        return btoa(JSON.stringify(rawMapping));  
    }
    
    decodeMapping(encodedMapping) {
        return JSON.parse(atob(encodedMapping));
    }
    
    onMappingReceived(mapping, callback) {
        log(mapping, this.TAG);
        this.setMapping(mapping);
        callback(mapping);
    }
    
    onEventsReceived(event) {
        this.events.push(event);
        log(events, this.TAG);
    }
    
    onStoppedReceiving() {
        // update view
        log("onStoppedReceiving", this.TAG);
    }
}


let loginController = new LoginController();
let mainController = new MainController(loginController);
mainController.start();




