/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 02/08/17
 * Copyright (c) 02/08/17 University of Bern
 */

class AlertView {
    constructor(elementId="body") {
        this.TYPE = "";
        let elRef;
        if (elementId === "body") elRef = document.body;
        else elRef = document.getElementById(elementId);
        this.elRef = elRef;
        this.actualAlert = null;
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
        this.actualAlert = newEl;
    }

    clear() {

        try {
            this.elRef.removeChild(this.actualAlert);
        } catch (e) {
            log(e, "AlertView - clear");
        }
    }

    /***
     * Should be abstract
     */
    getTemplate() {
        // ... DO NOT IMPLEMENT
    }
}

class WarningAlertView extends AlertView {
    constructor(elementId="body") {
        super(elementId);
        this.TYPE = "warning";
    }

    getTemplate(content) {
        return `
            <div class="alert alert-dismissible alert-warning" id="alert">
                <button type="button" class="close" onclick="$('#alert').hide();">×</button>
                <h4>Warning!</h4>
                <strong>${content}</strong>
            </div>
            `;
    }
}