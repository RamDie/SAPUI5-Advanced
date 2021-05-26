// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/Employees/model/formatter"
], function (Controller,formatter) {
    return Controller.extend("logaligroup.Employees.controller.EmployeeDetails", {
        onInit: function () {
            this._bus = sap.ui.getCore().getEventBus();
        },
        onCreateIncidence: function(){
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence   = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel"); 
            var odata = incidenceModel.getData();
            var index = odata.length;
            odata.push({index : index + 1});
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);
        },
        onDeleteIncidence(oEvent){
            var contexjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            this._bus.publish("incidence", "onDeleteIncidence", { 
                IncidenceId: contexjObj.IncidenceId,
                SapId: contexjObj.SapId,
                EmployeeId: contexjObj.EmployeeId
             });
        },
        Formatter: formatter,
        onSaveIncidence: function(oEvent){
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            //var temp = incidenceRow.sPath.replace('/','');
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow : incidenceRow.sPath.replace('/','') });
        },
        updateIncidenceCreationDate: function(oEvent){
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.CreationDateX = true;
        },
        updateIncidenceReason: function(oEvent){
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.ReasonX = true;
        },
        updateIncidenceType: function(oEvent){
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            contextObj.TypeX = true;
        }                
    });
});