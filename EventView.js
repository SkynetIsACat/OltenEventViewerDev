/***
 * @project DashboardOltenQuestionnaires
 * @author NSchuetz on 14/08/17
 * Copyright (c) 14/08/17 University of Bern
 */

class EventView {

    constructor(elementId, controller) {
        if (this.constructor === EventView) {
            throw new Error("Cannot instantiate this class!");
        }
        this.elementId = elementId;
        this.controller = controller;
    }

    setElementId(elementId) {
        this.elementId = elementId;
    }

    clear() {
        let element = document.getElementById(this.elementId);
        if (element !== null) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }

    // TODO Implement FIFO behaviour
    render(eventObjects, elementId=this.elementId) {
        let domElement = document.getElementById(elementId);
        let fragment = document.createDocumentFragment();
        log(eventObjects, "render");
        for (let i=0; i < eventObjects.length; i++) {
            let e = eventObjects[i];
            let userName = e.connection.username;
            let filledBy = e.tags[0];
            let type;
            let filledOn = new Date(e.created * 1000);
            let date = new Date(e.time * 1000); // TODO: Check if there is a better way to do this
            let newEl = document.createElement("div");
            let template;

            if (e.tags.length > 1) type = e.tags[1];
            else {
                type = e.tags[0];
                filledBy = "Unbekannt";
            }

            date = date.toLocaleString();
            filledOn = filledOn.toLocaleString();

            // adjust margin for first element
            if (i === 0) {
                template = this.getTemplate(date, userName, filledBy, filledOn, "margin-top:15px;");
            }
            else template = this.getTemplate(date, userName, filledBy, filledOn);

            // create dom nodes and add respective event-listeners
            newEl.innerHTML = template;
            newEl.addEventListener("click", () => {
                let modal = document.getElementById("event-content-modal");
                modal.innerHTML = this.getModalTemplate(
                    userName, filledOn, date, filledBy, type , e.content
                );
                $(".event-content-modal").modal("show");
            });
            fragment.appendChild(newEl);
        }
        domElement.appendChild(fragment);
    }

    getTemplate(date, userName, filledBy, filledOn, style="") {
        // language=HTML
        return `
            <div class="animated fadeIn">
            <div class="list-group-item" style="${style}">
                <div class="row-action-primary">
                    <i class="material-icons desc">description</i>
                </div>
                <div class="row-content">
                    <div class="least-content">${date}</div>
                    <h4 class="list-group-item-heading">${userName}</h4>
                    <p class="list-group-item-text">Ausgefüllt durch: ${filledBy}</p>
                    <p class="list-group-item-text">Ausgefüllt am: ${filledOn}</p>
                </div>
            </div>
            <div class="list-group-separator"></div>
            </div>
            `;
    }

    // TODO: Refactor modal creation into sub-parts
    getModalTemplate(username, dateCreated, dateFilled, createdBy, type, content) {
        let tempContent = content.split(";");
        log(tempContent, "extractContent");
        return `
        <div>
            <row>
                <div class="col-sm-6"><strong>Teilnehmer ID:</strong></div>
                <div class="col-sm-6">${username}</div>
            </row>
            <row>
                <div class="col-sm-6"><strong>Erstellt am:</strong></div>
                <div class="col-sm-6">${dateCreated}</div>
            </row>
            <row>
                <div class="col-sm-6"><strong>Ausgefüllt am:</strong></div>
                <div class="col-sm-6">${dateFilled}</div>
            </row>
            <row>
                <div class="col-sm-6"><strong>Erstellt von:</strong></div>
                <div class="col-sm-6">${createdBy}</div>
            </row>
            <row>
                <div class="col-sm-6"><strong>Typ:</strong></div>
                <div class="col-sm-6">${type}</div>
            </row>
            <row>
                <div class="col-xs-12">
                    <br> <strong>Inhalt</strong> <br>
                    <br> 
                    <strong>1. Wahrnehmung Ihres Gesundheitszustandes</strong>
                    <br>
                    1.1 Mobilität Beweglichkeit: ${tempContent[3]} ${tempContent[4]} ${tempContent[5]}
                    <br>
                    1.2 Für sich selber sorgen: ${tempContent[6]} ${tempContent[7]} ${tempContent[8]}
                    <br>
                    1.3 Alltägliche Aktivitäten: ${tempContent[9]} ${tempContent[10]} ${tempContent[11]}
                    <br>
                    1.4 Schmerzen/ Körperliche Beschwerden: ${tempContent[12]} ${tempContent[13]} ${tempContent[14]}
                    <br>
                    1.5 Ängstlichkeit/ Depression: ${tempContent[15]} ${tempContent[16]} ${tempContent[17]}
                    <br>
                    1.6 Gesundheitszustand auf der Skala: ${tempContent[18]}
                    <br> 
                    <br>
                    <strong>2.1	Erhebung des gesamthaften Gesundheitszustandes heute</strong> 
                    <br>
                    2.1.1 Fühlen Sie sich gesundheitlich gut? ${tempContent[19]}
                    <br>
                    2.1.2 Fühlen Sie sich traurig? ${tempContent[20]}
                    <br>
                    2.1.3 Fühlen Sie sich müde? ${tempContent[21]}
                    <br>
                    2.1.4 Haben Sie zu Hause einen Unfall gehabt? ${tempContent[22]}<br>
                    <a style="color:black !important;" data-toggle="collapse" href="#unfall"><i style="font-size:24px;" class="material-icons">arrow_drop_down</i> Details</a>
                    <div id="unfall" class="panel-collapse collapse">
                        <div class="panel-body">
                        ${tempContent[47]}
                        <br> 
                        ${tempContent[48]} 
                        <br>
                        Ort des Unfalls: ${tempContent[49]}
                        </div>
                   </div>
                    <br>
                    2.1.5 Haben Sie Fieber gehabt? ${tempContent[23]}<br>
                    <a style="color:black !important;" data-toggle="collapse" href="#fieber"><i style="font-size:24px;" class="material-icons">arrow_drop_down</i> Details</a>
                    <div id="fieber" class="panel-collapse collapse">
                        <div class="panel-body">
                        ${tempContent[50]} 
                        <br>
                        Anzahl Tage: ${tempContent[51]} 
                        </div>
                   </div>
                    <br>  
                    2.1.6 Andere Symptome? ${tempContent[24]}<br>
                    <a style="color:black !important;" data-toggle="collapse" href="#symtome"><i style="font-size:24px;" class="material-icons">arrow_drop_down</i> Details</a>
                    <div id="symtome" class="panel-collapse collapse">
                        <div class="panel-body">
                        ${tempContent[25]} 
                        <br> 
                        ${tempContent[52]} 
                        <br>
                        Anzahl Tage: ${tempContent[53]}
                        </div>
                   </div>
                    <br>
                    <br>
                    <strong>2.2 Gewohnheiten</strong>
                    <br>
                    <strong>Aktivitäten</strong>
                    <br>
                    2.2.1 Haben Sie selber gekocht? ${tempContent[26]} 
                    <br>
                    2.2.2 Sind Sie ausgegangen? ${tempContent[27]}<br>
                    <a style="color:black !important;" data-toggle="collapse" href="#ausgang"><i style="font-size:24px;" class="material-icons">arrow_drop_down</i> Details</a>
                    <div id="ausgang" class="panel-collapse collapse">
                        <div class="panel-body">
                            <br>
                            ${tempContent[28]} 
                            <br>
                            ${tempContent[29]}
                            <br>
                            ${tempContent[30]}
                            <br>     
                            ${tempContent[31]}     
                            <br>
                            ${tempContent[32]}    
                            <br> 
                            ${tempContent[33]} 
                            <br>
                            ${tempContent[34]} 
                            <br>
                            ${tempContent[35]} Anzahl Tage: ${tempContent[36]} 
                        </div>
                    </div>
                    <br>
                    2.2.3 Hatten Sie Besuch? ${tempContent[37]} <br>
                    <a style="color:black !important;" data-toggle="collapse" href="#besuch"><i style="font-size:24px;" class="material-icons">arrow_drop_down</i> Details</a>
                    <div id="besuch" class="panel-collapse collapse">
                        <div class="panel-body">
                        <br>
                        ${tempContent[38]} 
                        <br>
                        ${tempContent[39]} 
                        <br>
                        ${tempContent[40]} 
                        <br>
                        ${tempContent[41]} 
                        <br>
                        ${tempContent[42]}  ${tempContent[43]} 
                         </div>
                    </div>
                    <br>
                    2.2.4 Haben sich Ihre Lebensgewohnheiten geändert? ${tempContent[44]}${tempContent[45]}<br>
                    ${tempContent[46]}
                 </div>
            </row>
        </div>
        `;
    }
}