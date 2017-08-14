
class LoadingView {
    constructor(elementId, containerId, controller) {
        this.elementId = "#" + elementId;
        this.containerId = "#" + containerId;
        this.controller = controller;
        // TODO: move state to its own model
        this.actualPercentageShown = 0;
    }

    init() {
        //...
    }

    update(data) {
        log(data, "loadingView");
        this.actualPercentageShown += data;
        this.render(this.actualPercentageShown);
        if (this.actualPercentageShown >= 100) {
            setTimeout( () => {
                this.clear();
                this.actualPercentageShown = 5;
            }, 500);
        }
    }

    render(percentage) {
        $(this.containerId).show();
        $(this.elementId).css("width", this.toPercentageString(percentage));
    }

    clear() {
        $(this.containerId).hide();
    }

    toPercentageString(percentNumber) {
        return percentNumber.toString() + "%";
    }
}