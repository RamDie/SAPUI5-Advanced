// @ts-nocheck
sap.ui.define([
    "logaligroup/Employees/controller/Base.controller",
    "logaligroup/Employees/model/formatter",
    "sap/m/MessageBox"
], function (Base, formatter, MessageBox) {
    return Base.extend("logaligroup.Employees.controller.EmployeeDetails", {
        onInit: function () {
            this._bus = sap.ui.getCore().getEventBus();
        },
        onCreateIncidence: function () {
            var tableIncidence = this.getView().byId("tableIncidence");
            var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length;
            //Se fuerzan valores en el modelo, que
            odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);
        },
        onDeleteIncidence(oEvent) {
            var contexjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
                onClose: function (oAction) {

                    if (oAction === "OK") {
                        this._bus.publish("incidence", "onDeleteIncidence", {
                            IncidenceId: contexjObj.IncidenceId,
                            SapId: contexjObj.SapId,
                            EmployeeId: contexjObj.EmployeeId
                        });
                    }
                }.bind(this)
            }
            );
        },
        Formatter: formatter,
        onSaveIncidence: function (oEvent) {
            var incidence = oEvent.getSource().getParent().getParent();
            var incidenceRow = incidence.getBindingContext("incidenceModel");
            //var temp = incidenceRow.sPath.replace('/','');
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
        },
        updateIncidenceCreationDate: function (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            if (!oEvent.getSource().isValidValue()) { //No se obtiene directo del modelo (incidenceModel>CreationDate) porque los valores erróneos no se actualizan quedando la fecha previa
                contextObj._ValidateDate = false;
                contextObj.CreationDateState = "Error";
                MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                    title: "Error",
                    onClose: null,
                    styleClass: "",
                    actions: MessageBox.Action.Close,
                    emphasizedAction: null,
                    initialFocus: null,
                    textDirection: sap.ui.core.TextDirection.Inherit
                });
            } else {
                contextObj.CreationDateX = true;
                contextObj._ValidateDate = true;
                contextObj.CreationDateState = "None";
            }

            if (oEvent.getSource().isValidValue() && contextObj.Reason) {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            }

            context.getModel().refresh(); //Para aplicar los cambios de arriba
        },
        updateIncidenceReason: function (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();

            if (oEvent.getSource().getValue()) {
                contextObj.ReasonX = true;
                contextObj.ReasonState = "None";
            } else {
                contextObj.ReasonState = "Error";
            };

            if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };

            context.getModel().refresh(); //Para aplicar los cambios de arriba

        },
        updateIncidenceType: function (oEvent) {
            var context = oEvent.getSource().getBindingContext("incidenceModel");
            var contextObj = context.getObject();

            if (contextObj._ValidateDate && contextObj.Reason) {
                contextObj.EnabledSave = true;
            } else {
                contextObj.EnabledSave = false;
            };

            contextObj.TypeX = true;
        }  
    });
});