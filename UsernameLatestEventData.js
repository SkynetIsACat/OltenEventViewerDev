/***
 * @project OltenEventViewerDev
 * @author NSchuetz on 06/10/17
 * Copyright (c) 06/10/17 University of Bern
 */

/**
 * Used to get events from a specific user.
 */
class UsernameLatestEventData extends LatestEventData {

    constructor(controller, loader, userConnection ,streams , eventsLimit=1000, displayLimit=15) {
        super(controller, loader, userConnection ,streams , eventsLimit, displayLimit);
        this.username = null;
    }

    update(filter, loadingPercentage, username=null) {
        // this.username = filter._settings.tags[0];
        this.username = username;

        let newFilter = new pryv.Filter({
            limit: 500,
            streams: STREAMS,
        });

        console.log("filter: ", newFilter);
        this.reloadData(filter, loadingPercentage);
        this.startDisplayPosition = 0;
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
        let target_count;

        if (this.username === null)
            target_count = this.mapping.length;
        else
            target_count = 1;

        log(filter, "check Filter");
        for (let i=0; i < this.mapping.length; i++) {
            let _mapping = this.mapping[i];
            if (this.username !== null && this.username !== _mapping.name)
                continue;
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
                if (successCount === target_count){
                    this.loadingSubject.notify(loadPercentage); // Add 50% to loading
                    this.appendEvents(result);
                }
            });
        }
    }
}