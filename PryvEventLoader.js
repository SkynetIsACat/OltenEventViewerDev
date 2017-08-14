/***
 * Helper Class to load events from Pryv
 */
class PryvEventLoader {

    constructor() {
        this.MAPPING_LIMIT = 1000;
        this.MAPPING_STREAM_ID = "access-tokens";
    }

    /***
     * Loads events from a pryv user
     * @param {Connection} connection: Pryv connection object, corresponding to the user auth data events should be loaded
     * @param {Filter} filter: Pryv filter object, specifying criteria for event retrieval.
     * @param {function} callback: Callback function defining what should be done after event retrieval
     */
    loadEvents(connection, filter, callback) {
        connection.events.get(filter, (err, events) => {
            log(err, "PryvEventLoader");
            callback(err, events);
        });
    }

    /***
     * Loads mapping (username and access token) of pryv users we want to retrieve events for.
     * @param {Connection} connection: Pryv connection object of current user
     * @param {function} callback: Callback function defining what should be done after mapping retrieval
     */
    loadMapping(connection, callback) {
        let filter = new pryv.Filter({limit:this.MAPPING_LIMIT, streams: [this.MAPPING_STREAM_ID]});
        this.loadEvents(connection, filter, (err, events) => {
            let mapping = PryvEventLoader.extractContent(events);
            log(mapping, "loadMapping");
            callback(err, mapping);
        });
    }

    /***
     * Extracts the complete actual mapping (content) out of the whole event retrieved
     * @param {Array} eventArray: Array of pryv Events
     * @returns {Array}: extracted Array of content objects
     */
    static extractContent(eventArray) {
        let length = eventArray.length;
        let resultArray = [];
        for (let i=0; i < length; i++) {
            resultArray.push(eventArray[i].content);
        }
        return resultArray;
    }
}