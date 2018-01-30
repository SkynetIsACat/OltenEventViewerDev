/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 01/08/17
 * Copyright (c) 01/08/17 University of Bern
 */

/**
 * Controls broader logic of website interactions with the user.
 */
class MainController {

    constructor(userConnection, elementId, categoryElementId) {
        this.elementId = elementId;
        this.userConnection = userConnection;
        this.categoryElementId = categoryElementId;
        this.views = null;
        this.models = null;
        this.options = {
            streams: STREAMS,
            tags:[],
            fromTime:null,
            toTime:null
        };
    }

    init() {
        let initInstance = function (obj, prop) { obj[prop].init(); };

        let eventLoader = new PryvEventLoader();
        let latestEventView = new LatestEventView(this.elementId, this);
        let latestEventData = new UsernameLatestEventData(this, eventLoader, this.userConnection, STREAMS);
        let alertViewTest = new WarningAlertView();
        let alertViewSuccess = new SuccessAlertView();
        let confirmDeleteAlert = new WarningConfirmationView(this);
        let categoryData = new UsernameCategoryEventData(eventLoader, this.userConnection, STREAMS);
        let categoryView = new CategoryView("cat-events", this, this.categoryElementId);
        let latestEventViewHeader = new NavHeaderView(this, this.elementId + "-header", "Aktuellste Events");
        let loadingView = new LoadingView("loading-view", "loading-view-container", this);
        let optionView = new OptionView("option-view", this);

        categoryData.registerListener(categoryView);
        latestEventData.registerListener(latestEventView);
        latestEventData.registerAlert(alertViewTest);
        latestEventData.registerLoadingView(loadingView);
        categoryData.registerLoadingView(loadingView);

        this.views = {
            latestEventView: latestEventView,
            categoryView: categoryView,
            alertViewTest: alertViewTest,
            latestEventViewHeader: latestEventViewHeader,
            loadingView: loadingView,
            optionView: optionView,
            warningConfirmationView: confirmDeleteAlert,
            successAlertView: alertViewSuccess
        };
        this.models = {
            latestEventData: latestEventData,
            categoryData: categoryData
        };

        this.iterateObject(this.views, initInstance);
        this.iterateObject(this.models, initInstance);
    }

    remove() {
        this.iterateObject(this.views, (obj, prop) => {
           try {
               obj[prop].clear();
           } catch (e) {
               log(e, "logOut");
           }
        });
    }

    iterateObject(obj, f) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) f(obj, prop);
        }
    }

    loadNextEvents() {
        this.models.latestEventData.loadNext();
    }

    loadPreviousEvents() {
        this.models.latestEventData.loadPrevious();
    }

    updateOptions(options) {
        this.options = options;
    }

    updateEventData() {
        const pFilter = new pryv.Filter({
            streams: this.options.streams,
            tags: this.options.tags,
            fromTime: this.options.fromTime,
            toTime: this.options.toTime
        });
        this.models.latestEventData.update(pFilter, 100);
        this.models.categoryData.update(pFilter);
    }

    onCategoryClicked(category) {
        // TODO: allow switching between different categories
        this.views.loadingView.update(0);
        let filter;
        if (category === "Nicht kategorisiert") {
            filter = new pryv.Filter({
                limit: 500,
                streams: this.options.streams,
                tags: this.options.tags,
                fromTime: this.options.fromTime,
                toTime: this.options.toTime
            });
        }
        else {
            filter = new pryv.Filter({
                limit: 500,
                streams: this.options.streams,
                tags: this.options.tags,
                fromTime: this.options.fromTime,
                toTime: this.options.toTime,
            });
        }
        this.models.latestEventData.update(filter, 100, category);
    }

    askRemoveEvent(event) {
        log(event, "askRemoveEvent");
        this.views.warningConfirmationView.render("Do you really want to delete this event?", event);
    }

    removeEvent(event) {
        this.models.categoryData.deleteEvent(event, (deletedEvent) => {
            if (deletedEvent.id === event.id) {
                this.views.successAlertView.render("Event successfully deleted!");
                this.updateEventData();
            }
            else
                this.views.alertViewTest.render("Could not delete the selected event!");
        });

    }

}