/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 14/08/17
 * Copyright (c) 14/08/17 University of Bern
 */

class CategoryView extends EventView {
    constructor(elementId, controller, categoryElementId) {
        super(elementId, controller);
        this.categoryElementId = categoryElementId;
        this.DEFAULT_CATEGORY_NAME = "Nicht kategorisiert"
    }

    init() {
        this.clear();
        this.render([]);
    }

    update(data) {
        log(data, "CategoryView");
        this.clear();
        this.render(data);
    }

    render(data) {
        for (let i=0; i < data.length; i++) {
            let dataObject = data[i];

            // Make sure not categorized objects are displayed last. TODO: move to model
            if (dataObject.key === "Default") {
                dataObject.key = this.DEFAULT_CATEGORY_NAME;
                data.push(dataObject);
                continue;
            }

            let btnId = dataObject.key + "-btn";

            let containerEl = document.getElementById(this.categoryElementId);
            let el = document.createElement("div");
            el.innerHTML = this.getContainerTemplate(dataObject.key, btnId);
            containerEl.appendChild(el);
            document.getElementById(btnId).addEventListener("click", () => {
                this.controller.onCategoryClicked(dataObject.key);
            });
            super.render(dataObject.value, dataObject.key);
        }
    }

    clear() {
        let element = document.getElementById(this.categoryElementId);
        if (element !== null) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }

    getContainerTemplate(name, btnId) {
        return `
        <div class="animated fadeIn panel panel-primary">
            <div class="panel-heading category-panel">${name}<a style="float: right" id="${btnId}" title="Filter by Category"><i class="material-icons">filter_list</i></a></div>
            <div id="${name}" class="list-group">
            </div>
        </div>
        `;
    }
}