/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 14/08/17
 * Copyright (c) 14/08/17 University of Bern
 */

class NavHeaderView {

    constructor(controller, elementId, content) {
        this.controller = controller;
        this.elementId = elementId;
        this.content = content;
    }

    init() {
        this.clear();
        this.render();
    }

    render() {
        let el = document.getElementById(this.elementId);
        if (el !== null) {
            el.innerHTML = this.getNavTemplate();
            document.getElementById(this.elementId + "-next").addEventListener("click", () => {
                this.controller.loadNextEvents();
            });
            document.getElementById(this.elementId + "-before").addEventListener("click", () => {
                this.controller.loadPreviousEvents();
            });
        }
    }

    clear() {
        let el = document.getElementById(this.elementId);
        if (el !== null) el.innerHTML = "";
    }


    getNavTemplate() {
        return `
        <div style="position: absolute; left:0; margin-top:8px; text-align: center; width: 100%;">
            ${this.content}
        </div>
        <div>
            <i class="nav-panel material-icons nav-right" id="${this.elementId + '-next'}">navigate_next</i>
            <i class="nav-panel material-icons nav-left" id="${this.elementId + '-before'}">navigate_before</i>
        </div>
        `;
    }

}