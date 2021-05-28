// @ts-nocheck

sap.ui.define([
    "logaligroup/Employees/controller/Base.controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Base, Filter, FilterOperator) {
        "use strict";

        /*function myCheck() {
            var inputEmployee = this.byId("inputEmployee");
            var valueEmployee = inputEmployee.getValue();

            if (valueEmployee.length === 6) {
                //inputEmployee.setDescription("OK");
                this.byId("labelCountry").setVisible(true);
                this.byId("slCountry").setVisible(true);
            } else {
                this.byId("labelCountry").setVisible(false);
                this.byId("slCountry").setVisible(false);
            };
        };*/

        return Base.extend("logaligroup.Employees.controller.MasterEmployee", {

            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();
            },

            //onValidate: myCheck,
            onFilter: function () {
                var oJSONCountries = this.getView().getModel("jsonCountries").getData();

                var filters = [];

                if (oJSONCountries.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId));
                }
                if (oJSONCountries.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey));
                }

                var oList = this.getView().byId("tableEmployee");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },
            onClearFilter: function () {
                var oModel = this.getView().getModel("jsonCountries");
                oModel.setProperty("/EmployeeId", "");
                oModel.setProperty("/CountryKey", "");
            },
            showPostalCode: function (oEvent) {
                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("odataNorthwind");
                var objectContext = oContext.getObject();
                sap.m.MessageToast.show(objectContext.PostalCode);
            },
            onShowCity: function () {
                var oJSONModelConfig = this.getView().getModel("jsonConfig");
                oJSONModelConfig.setProperty("/visibleCity", true);
                oJSONModelConfig.setProperty("/visibleBtnShowCity", false);
                oJSONModelConfig.setProperty("/visibleBtnHideCity", true);
            },
            onHideCity: function () {
                var oJSONModelConfig = this.getView().getModel("jsonConfig");
                oJSONModelConfig.setProperty("/visibleCity", false);
                oJSONModelConfig.setProperty("/visibleBtnShowCity", true);
                oJSONModelConfig.setProperty("/visibleBtnHideCity", false);
            },
            showOrders: function (oEvent) {
                var iconPressed = oEvent.getSource();
                var oContext = iconPressed.getBindingContext("odataNorthwind");

                if (!this._oDialogOrders) {
                    this._oDialogOrders = sap.ui.xmlfragment("logaligroup.Employees.fragment.DialogOrders", this);
                    this.getView().addDependent(this._oDialogOrders);
                };
                this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
                this._oDialogOrders.open();
            },
            onCloseOrders: function () {
                this._oDialogOrders.close();
            },
            showEmployee: function(oEvent){
                var path = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
                this._bus.publish("flexible", "showEmployee", path);
            }
        })
    });
