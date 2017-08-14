

/***
 * Data Model, responsible for handling latest event data
 */
class LatestEventData extends GenericDataModel {
    /***
     * Constructor
     * @param {MainController} controller: Reference to controller
     * @param {PryvEventLoader} loader: Helps loading events from pryv database
     * @param {Connection} userConnection:  Connection object of the current logged in user
     * @param {Array} streams: Default String Array specifying the streams to retrieve events for
     * @param {Number} eventsLimit: default=1000 Number of events per pryv request
     * @param {Number} displayLimit: default=15 Number of events to display
     */
    constructor(controller, loader, userConnection ,streams , eventsLimit=1000, displayLimit=15) {
        super(loader, userConnection, streams, eventsLimit);
        this.controller = controller;
        this.data = [];
        this.sortAscending = false;
        this.displayLimit = displayLimit;
        this.alertSubject = new Subject();
        this.startDisplayPosition = 0;
    }

    setSortAscending (boolean) {
        this.sortAscending = boolean;
    }

    setStreams(streams) {
        this.streams = streams;
    }

    setDisplayLimit(limit) {
        this.displayLimit = limit;
    }

    getData() {
        return this.data.slice(this.startDisplayPosition, this.startDisplayPosition + this.displayLimit);
    }

    addData(events) {
        this.data = this.data.concat(events);
        this.subject.notify(this.getData());
        if (this.data.length >= this.eventsLimit) {
            this.alertSubject.notify({
                type: "warning",
                content:"More than 999 events, use filters to refine search!"
            });
        }
    }

    update(filter, loadingPercentage) {
        this.reloadData(filter, loadingPercentage);
        this.startDisplayPosition = 0;
    }

    setEventsLimit(limit) {
        if (limit > 0) this.eventsLimit = limit;
        else throw new Error("Event Limit must be greater than 0");
    }

    init() {
        this.loadMapping(this.userConnection);
    }

    registerListener(listener) {
        this.subject.addListener(listener);
    }

    registerAlert(listener) {
        this.alertSubject.addListener(listener);
    }

    removeListener(listener) {
        this.subject.removeListener(listener);
    }

    loadNext() {
        if ( !((this.startDisplayPosition + (2*this.displayLimit)) > this.data.length )) {
            this.startDisplayPosition += this.displayLimit;
            this.subject.notify(this.getData());
        }
        else {
            this.startDisplayPosition = this.data.length - this.displayLimit;
            this.subject.notify(this.getData());

            this.alertSubject.notify({
                type: "warning",
                content: "Maximum number of events loaded!"
            });
        }
    }

    loadPrevious() {
        if ( !((this.startDisplayPosition - this.displayLimit) < 0) ) {
            this.startDisplayPosition -= this.displayLimit;
            this.subject.notify(this.getData());
        }
        else {
            this.startDisplayPosition = 0;
            this.subject.notify(this.getData());
            this.alertSubject.notify({
                type: "warning",
                content: "Most frequent events already loaded!"
            });
        }
    }

    /***
     * Sorts data by event time and notifies listeners
     */
    sortByConducted() {
        let fsort;
        if (this.sortAscending) {
            fsort = function (a, b) {
                return a.time - b.time;
            }
        } else {
            fsort = function (a , b) {
                return b.time - a.time;
            }
        }
        this.data = this.data.sort(fsort);
        this.subject.notify(this.getData());
    }

    /***
     * Sorts data by time they were submitted and notifies listeners
     */
    sortBySubmitted() {
        let fsort;
        if (this.sortAscending) {
            fsort = function (a, b) {
                return a.created - b.created;
            }
        } else {
            fsort = function (a , b) {
                return b.created - a.created;
            }
        }
        this.data.sort(fsort);
        this.subject.notify(this.getData());
    }

    /***
     * Appends and sorts received events to the instance's data buffer
     * @param {Array} events: Array of pryv events
     */
    appendEvents(events) {
        this.data = this.data.concat(events);
        this.sortByConducted();
        if (this.data.length >= this.eventsLimit) {
            this.alertSubject.notify({
                type:"warning",
                content:"There are more than 1000 Events available, please refine your filter criteria!"
            });
        }
        log(this.data, "appendEvents");
    }
}
