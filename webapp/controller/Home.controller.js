sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"sap/m/MessageToast"
], function(Controller, formatter, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oViewModel = new sap.ui.model.json.JSONModel({
				isEmailValid: false
			});

			this.setModel(oViewModel, "viewModel");
		},

		_isValidEmail: function (sEmail) {
			return /\@/.test(sEmail);
		},

		onSubmit: function () {
			MessageToast.show("input changed");
		},

		onInputChanged: function (oEvent) {
			// var oSubmit = this.byId("btnSubmit");
			var bIsValidEmail = this._isValidEmail(oEvent.getParameter("newValue"));
			this.getModel("viewModel").setProperty("/isEmailValid", bIsValidEmail);

			// oEvent.getSource().setValueState(  bIsValidEmail ? sap.ui.core.ValueState.None : sap.ui.core.ValueState.Error);
			//oEvent.getSource().setValueStateText(  bIsValidEmail ? "" : "Invalid email");

			// oSubmit.setEnabled( bIsValidEmail );

			MessageToast.show("input changed");
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

	});
});