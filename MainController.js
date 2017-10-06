/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 01/08/17
 * Copyright (c) 01/08/17 University of Bern
 */

class MainController {

    constructor(userConnection, elementId, categoryElementId) {
        this.elementId = elementId;
        this.userConnection = userConnection;
        this.categoryElementId = categoryElementId;
        this.views = null;
        this.models = null;
    }

    init() {
        let initInstance = function (obj, prop) { obj[prop].init(); };
        let eventLoader = new PryvEventLoader();
        let latestEventView = new LatestEventView(this.elementId, this);
        let latestEventData = new UsernameLatestEventData(this, eventLoader, this.userConnection, STREAMS);
        let alertViewTest = new WarningAlertView();
        let categoryData = new UsernameCategoryEventData(eventLoader, this.userConnection, STREAMS);
        let categoryView = new CategoryView("cat-events", this, this.categoryElementId);
        let latestEventViewHeader = new NavHeaderView(this, this.elementId + "-header", "Aktuellste Events");
        let loadingView = new LoadingView("loading-view", "loading-view-container", this);

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
            loadingView: loadingView
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

    onCategoryClicked(category) {
        // TODO: allow switching between different categories
        this.views.loadingView.update(0);
        let filter;
        if (category === "Nicht kategorisiert") {
            filter = new pryv.Filter({
                limit: 500,
                streams: STREAMS,
            });
        } else {
            filter = new pryv.Filter({
                limit: 500,
                streams: STREAMS,
                tags: [category]
            });
        }
        this.models.latestEventData.update(filter, 100);
    }

}