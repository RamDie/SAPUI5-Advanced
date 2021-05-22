// @ts-nocheck

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, Filter, FilterOperator) {
        "use strict";

        function myCheck(){
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
        }

        return Controller.extend("logaligroup.Employees.controller.MainView", {

            onInit: function () {
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oView = this.getView();
                var i18nBundle = oView.getModel("i18n").getResourceBundle();

                oJSONModel.loadData("./localService/mockdata/Employees.json");

                oView.setModel(oJSONModel);
            },            
            
            onValidate: myCheck,
            onFilter: function(){
                var oJSON = this.getView().getModel().getData();

                var filters = [];

                if(oJSON.EmployeeId !== ""){
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSON.EmployeeId ));
                }
                if(oJSON.CountryKey !== ""){
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSON.CountryKey ));
                }

                var oList = this.getView().byId("tableEmployee");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },
            onClearFilter: function(){
                var oModel = this.getView().getModel();
                oModel.setProperty("/EmployeeId","");
                oModel.setProperty("/CountryKey","");
            },
            showPostalCode: function(oEvent){
                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext();
                var objectContext = oContext.getObject();
                sap.m.MessageToast.show(objectContext.PostalCode);
            }
        });
    });
