/***
 * Abstract Data Model class defining basic functionality for the Observer pattern and pryv event/mapping loading
 */
class GenericDataModel {

    constructor(loader, userConnection, streams, limit) {
        this.loader = loader;
        this.userConnection = userConnection;
        this.streams = streams;
        this.eventsLimit = limit;

        if (this.constructor === GenericDataModel)
            throw new Error("Cannot instantiate this class!");

        this.subject = new Subject();
        this.loadingSubject = new Subject();
        this.mapping = null;
    }

    setSubject(subject) {
        this.subject = subject;
    }

    getSubject() {
        return this.subject;
    }

    reloadMapping(connection) {
        this.mapping = null;
        this.loadMapping(connection);
    }

    registerLoadingView(listener) {
        this.loadingSubject.addListener(listener);
    }

    unregisterLoadingView(listener) {
        this.loadingSubject.removeListener(listener);
    }

    /***
     * Loads Pryv username and access tokens for all defined
     *
     * @param connection
     */
    loadMapping(connection, filter=null) {
        this.loader.loadMapping(connection, (err, mapping) => {
            log(err);
            log(mapping);
            this.mapping = mapping;
            this.loadEventsFromMapping(filter);
        });
    }

    cleanData() {
        this.data = null;
        this.data = [];
    }

    /***
     * Appends received events to the instance's data buffer and triggers observer notification
     * @param {Array} events: Array of pryv events
     */
    appendEvents(events) {
        log(events, "appendEvents");
        //for (let i=0; i < events.length; i++) {
        //    this.data.push(events[i]);
        //}
        this.data.concat(events);
        this.subject.notify(this.data);
    }

    /***
     * Reloads data
     */
    reloadData(filter, percentageLoading) {
        this.cleanData();
        if (this.mapping !== null) this.loadEventsFromMapping(filter, percentageLoading);
        else this.loadMapping(this.userConnection, filter);
    }

    /***
     * Loads events for the specified streams (this.streams) of all users of which mapping was retrieved and appends it.
     */
    loadEventsFromMapping(filter=null, loadPercentage=50) {
        let newFilter;
        if (filter === null) {
            newFilter = new pryv.Filter({
                limit: this.eventsLimit,
                streams: this.streams
            });
        } else {
            newFilter = filter;
        }
        let result = [];
        let successCount = 0;
        log(filter, "check Filter");
        for (let i=0; i < this.mapping.length; i++) {
            let _mapping = this.mapping[i];
            let settings = {
                username: _mapping.name,
                auth: _mapping.token,
                domain: PRYV_SETTINGS.domain
            };
            let newConnection = new pryv.Connection( settings );
            this.loader.loadEvents(newConnection, newFilter, (err, events) => {
                successCount++;
                events.forEach((e) => {
                    result.push(e);
                });
                if (successCount === this.mapping.length){
                    this.loadingSubject.notify(loadPercentage); // Add 50% to loading
                    this.appendEvents(result);
                }
            });
        }
    }

    /**
     * Deletes a pryv event.
     * @param event: pryv event
     */
    deleteEvent(event, cb) {
        if (this.mapping === null) {
            log("Can't delete user as user mapping is not available!", "GenericDataModel");
            throw("Can't delete user as user mapping is not available!", "GenericDataModel");
        }

        /*
        const user = this.mapping.filter( (e) => {
            console.log(e.name, event.connection.);
            return e.name === event.id;
        });



        if (user === undefined)
            throw("Can't find this user");


        const connSettings = {
            username: user.name,
            auth: user.token,
            domain: PRYV_SETTINGS.domain
        };
        */

        //const pryvConnection = new pryv.Connection(connSettings);
        event.connection.events.delete(event, (err, eventDeleted) => {
            log(err, "eventDeleteError");
            log(eventDeleted, "eventDeleted");
            cb(eventDeleted);
        });
    }
}