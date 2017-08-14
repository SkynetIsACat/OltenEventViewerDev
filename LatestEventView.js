
class LatestEventView extends EventView {
    constructor(elementId, controller) {
        super(elementId, controller);
    }


    init() {
        // TODO: Show loading spinner or something
        this.clear();
    }

    update(data) {
        this.clear();
        this.render(data);
    }

}