/***
 * @project OltenEventViewerDev
 * @author NSchuetz on 06/10/17
 * Copyright (c) 06/10/17 University of Bern
 */

class UsernameCategoryEventData extends CategoryEventData {

    constructor(loader, userConnection, streams, limit=100) {
        super(loader, userConnection, streams, limit);
        //this.data = new Map();  // data: {Map( {String} : {Set} )}
    }

    extractCategories(events) {
        log(events, "extractCategories");
        let result = new Map();
        for (let i=0; i < events.length; i++) {
            let key;
            if (events[i].connection.username.length > 1)
                key = events[i].connection.username;
            else
                key = "Default";

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