/***
 * Used to implement Observer -> Listener pattern to notify views about data changes
 */
class Subject {
    constructor() {
        this.listeners = [];
    }

    /***
     * Notifies listeners about data change while passing the changed data
     * @param {Array} data: Array of actual data
     */
    notify(data) {
        for (let i=0; i < this.listeners.length; i++) {
            this.listeners[i].update(data);
        }
    }

    /***
     * Adds an EventListener
     * @param {Object} listener: reference to event listener
     */
    addListener(listener) {
        this.listeners.push(listener);
    }

    /***
     * Removes specified listener
     * @param {Object} listener: reference to respective listener
     */
    removeListener(listener) {
        let toRemove = this.listeners.findIndex( (e) => {
            return e === listener;
        });
        if (toRemove > -1) this.listeners.splice(toRemove, 1);
        log("Listener to remove not found", "PryvEventLoader");
    }
}