// @ts-nocheck

sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
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

            },
            onValidate: myCheck
        });
    });
