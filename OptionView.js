
class OptionView {

    static get INTERNAL_ID() { return "select-options"; }

    static get WIDTH() { return "100%"; }
    static get MARGIN_LEFT() { return "50px"; }
    static get MARGIN_TOP() { return "50px"; }

    static get DATE_RANGE_ID() { return this.INTERNAL_ID + "-date-picker"; }
    static get TIME_PICKER_ID() { return this.INTERNAL_ID + "-time-picker"; }
    static get CATEGORY_PICKER_ID() { return this.INTERNAL_ID + "-category-picker"; }
    static get SUBMIT_ID() { return this.INTERNAL_ID + "-submit"; }
    static get RESET_ID() { return this.INTERNAL_ID + "-reset"; }

    static get DEFAULT_SETTINGS() {
        return {
            fromTime: null,
            toTime: null,
            time:"00:00",
            streams: STREAMS,
            tags:[]
        };
    }

    constructor(id, controller) {
        this.id = id;
        this.controller = controller;
        this.settings = OptionView.DEFAULT_SETTINGS;
    }

    init() {
        this.render(null);
    }

    update(data) {

    }

    render(data) {
        const parentEl = document.getElementById(this.id);
        let childEl = document.createElement("div");

        childEl.innerHTML = this.getTemplate();
        parentEl.appendChild(childEl);
        //$("." + OptionView.INTERNAL_ID).chosen({});
        $("select").chosen({width:"98%"});

        $("#" + OptionView.DATE_RANGE_ID).dateRangePicker();

        $("#" + OptionView.DATE_RANGE_ID).bind('datepicker-apply', (event, object) => {
            this.settings.fromTime = object.date1.getTime()/1000;
            this.settings.toTime = object.date2.getTime()/1000;
        });

        this.addChangeListener(OptionView.TIME_PICKER_ID, () => {
            this.settings.startTime = $("#" + OptionView.TIME_PICKER_ID).val();
        });

        document.getElementById(OptionView.SUBMIT_ID).addEventListener("click", () => {

            this.settings.streams = $("#" + OptionView.CATEGORY_PICKER_ID).val();
            if (this.settings.streams === undefined)
                this.settings.streams = STREAMS;

            console.log(this.settings);

            this.controller.updateOptions(this.settings);
            this.controller.updateEventData();
        });

        document.getElementById(OptionView.RESET_ID).addEventListener("click", () => {
            this.settings = OptionView.DEFAULT_SETTINGS;
            $("#" + OptionView.CATEGORY_PICKER_ID).val([]).trigger("chosen:updated");
        });
    }

    addChangeListener(id, callback) {
        document.getElementById(id).addEventListener("change", callback)
    }

    clear() {
        let element = document.getElementById(this.elementId);
        if (element !== null) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        }
    }

    getTemplate() {
        return `
        <div class="panel panel-default" style="margin-top: ${this.MARGIN_TOP}; ">
          <div class="panel-body" style="">
            <div class="col-lg-12">
            
                <div class="row" style="width: 100%;" id="options">
   
                    <div class="col-md-6">
                    <div style="text-align: left; position:relative; top: 0px; margin-top: 10px;">
                        <strong>Filter</strong>
                        <select class="form-control ${OptionView.INTERNAL_ID}" id="${OptionView.CATEGORY_PICKER_ID}" multiple >
                                       
                          <option value="${Options.WEEKLY_QUESTIONNAIRES}">Wöchentliche Fragebögen</option>
                          <option value="${Options.ADDITIONAL_QUESTIONNAIRES}">Zusätzliche Fragebögen</option>
                          
                        </select>
                    </div>
                    </div>
                   
                   <div class="col-md-2">
                        <div title="Choose the time of the day - optional" style="text-align: center; position:relative; top: 0px; margin-top: 10px;">
                        <strong>Tageszeit (optional)</strong>
                            <input id="${OptionView.TIME_PICKER_ID}"  type="time" placeholder="Time"> 
                        </div>  
                    </div>
                    
                    
                    <div class="col-md-1">
                        <div style="text-align: center; position:relative; top: 0px; margin-top: 10px;">
                           <a title="Choose a date range!" id="${OptionView.DATE_RANGE_ID}" href="javascript:void(0)" class="btn btn-default btn-fab"><i class="material-icons">date_range</i></a>                  
                        </div>
                    </div>
                    
                    <div class="col-md-1">
                        <div style="text-align: center; position:relative; top: 0px; margin-top: 10px;">
                           <a title="Reset settings!" id="${OptionView.RESET_ID}" href="javascript:void(0)" class="btn btn-default btn-fab"><i class="material-icons">restore_page</i></a>                  
                        </div>
                    </div>
                              
                    <div class="col-md-2">
                        <div style="text-align: center; position: relative; top: 0px; margin-top: 10px;">
                            <a title="Apply settings!" style="width: 100%" id="${OptionView.SUBMIT_ID}" href="javascript:void(0)" class="btn btn-default btn-raised">OK</a>
                        </div>
                    </div>
                    

                </div>
                
            </div>
          </div>
        </div>
        `
    }
}