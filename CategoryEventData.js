/***
 * Data Model for Category View
 */
class CategoryEventData extends GenericDataModel {
    /***
     * Constructor
     * @param {PryvEventLoader} loader: Helps loading events from pryv database
     * @param {Connection} userConnection:  Connection object of the current logged in user
     * @param {Array} streams: String Array specifying the streams to retrieve events for
     * @param {Number} limit:20, max number of events per Pryv request
     */
    constructor(loader, userConnection, streams, limit=100) {
        super(loader, userConnection, streams, limit);
        this.data = new Map();  // data: {Map( {String} : {Set} )}
    }

    init() {
        this.loadMapping(this.userConnection);
    }

    update(filter) {
        this.reloadData(filter, 100);
    }

    cleanData() {
        this.data = new Map();
    }

    setStreams(streams) {
        this.streams = streams;
    }

    setEventsLimit(limit) {
        if (limit > 0) this.eventsLimit = limit;
        else throw new Error("Event Limit must be greater than 0");
    }

    registerListener(listener) {
        this.subject.addListener(listener);
    }

    removeListener(listener) {
        this.subject.removeListener(listener);
    }

    /***
     * Exposes the data in list form to consumers
     * @returns {Array} array contain objects -> { {string} : array[events] }
     */
    getData() {
        let result = [];
        this.data.forEach( (value, key, map) => {
            // Display only the first event
            let arr = Array.from(value);
            let sortedArr = arr.sort( (a, b) => {
                return b.time - a.time;
            });
            log(sortedArr[0], "sorted array");
            let obj = {key:key, value:[sortedArr[0]]};
            result.push(obj);
        });
        return result;
    }

    /***
     * Adds key, value pairs to the data Map, ensuring inter key and intra-value uniqueness
     * @param key
     * @param value
     */
    addData(key, value) {
        if (!this.data.has(key)) this.data.set(key,value);
        else {
            this.data.get(key).add(value);
        }
    }

    /***
     * Extracts Categories and appends received events to the instance's data buffer before triggering observer notification
     * @param {Array} events: Array of pryv events
     */
    appendEvents(events) {
        let newData = this.extractCategories(events);
        newData.forEach( (value, key, map) => {
            this.addData(key, value);
        });
        this.subject.notify(this.getData());
    }

    /***
     * Groups Events according to a category (here tags[0]) and returns the respective mapping
     * @param {Array} events
     * @returns {Map}: {key: [events]}
     */
    extractCategories(events) {
        log(events, "extractCategories");
        let result = new Map();
        for (let i=0; i < events.length; i++) {
            let key;
            if (events[i].tags.length > 1) key = events[i].tags[0];
            else key = "Default";
            if (result.has(key)) {
                //log(result.get(key), "extractCategories");
                result.get(key).add(events[i]);
            }
            else {
                let tempSet = new Set();
                result.set(key, tempSet.add(events[i]));
            }
        }
        return result;
    }
}