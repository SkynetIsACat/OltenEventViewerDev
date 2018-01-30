/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 02/08/17
 * Copyright (c) 02/08/17 University of Bern
 */

class AlertView {

    constructor(elementId="body", timer=null) {
        this.TYPE = "";
        let elRef;
        if (elementId === "body") elRef = document.body;
        else elRef = document.getElementById(elementId);
        this.elRef = elRef;
        this.actualAlerts = [];
        this.timer = timer;
    }


    init() {
        // ...
    }

    update(data) {
        this.clear();
        log("AlertView triggered", "update");
        if (data.type === this.TYPE) {
            this.clear();
            this.render(data.content);
        }
    }

    render(content) {
        let template = this.getTemplate(content);
        let newEl = document.createElement("div");
        newEl.innerHTML = template;
        this.elRef.appendChild(newEl);
        this.actualAlerts.push(newEl);
        this._setTimer();

    }

    _setTimer() {
        if (this.timer !== null) {
            setTimeout( () => {
                this.clear();
            }, this.timer);
        }
    }

    clear() {

        try {
            this.actualAlerts.forEach( (e) => {
                $(e).remove();
            });
        } catch (e) {
            log(e, "AlertView - clear");
        }
    }

    getTemplate(content) {
        return `
            <div class="alert alert-dismissible alert-${this.TYPE}" class="alert" id="alert">
                <button type="button" class="close" onclick="$('.alert').hide();">×</button>
                <h4>Warning!</h4>
                <strong>${content}</strong>
            </div>
            `;
    }
}

class WarningAlertView extends AlertView {
    constructor(elementId="body", timer=3000) {
        super(elementId, timer);
        this.TYPE = "warning";
    }
}

class WarningConfirmationView extends WarningAlertView {

    constructor(controller, elementId="body") {
        super(elementId);
        this.controller = controller;
        this.TYPE = "warning";
    }

    render(content, event) {
        let template = this.getTemplate(content);
        let newEl = document.createElement("div");
        let confirmDeleteButton = document.createElement("div");
        confirmDeleteButton.innerHTML = this.getConfirmDeleteTemplate();
        newEl.innerHTML = template;
        newEl.children[0].appendChild(confirmDeleteButton);
        confirmDeleteButton.addEventListener("click", () => {
           this.controller.removeEvent(event);
        });
        this.elRef.appendChild(newEl);
        this.actualAlerts.push(newEl);
    }

    getConfirmDeleteTemplate() {
        return `
           <a onclick="$('.alert').hide();" title="Ok!" style="" href="javascript:void(0)" class="btn btn-success btn-raised">OK</a>
        `;
    }
}

class SuccessAlertView extends AlertView {

    constructor(elementId="body", timer=3000) {
        super(elementId, timer);
        this.TYPE = "success"
    }


}
