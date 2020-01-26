sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function(BaseController, formatter, MessageToast, JSONModel) {
	"use strict";

	return BaseController.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oViewModel = new JSONModel({
				isEmailValid: false
			});

			this.setModel(oViewModel, "viewModel");
		},

		onSubmit: function () {
			MessageToast.show("input changed");
		},

		onInputChanged: function (oEvent) {
			var bIsValidEmail = this._isValidEmail(oEvent.getParameter("newValue"));
			this.getModel("viewModel").setProperty("/isEmailValid", bIsValidEmail);

			MessageToast.show("input changed");
		},

		onRefresh: function() {
			this.getModel().loadData("/backend/api/v1/Transactions");

			/* $.ajax({
				url: "/backend/api/v1/Transactions",
				method: "GET",
				success: (result, xhr, data) => {
					// here change the data
					this.getModel().setData(result);
				},
				error: function (e) {
					console.error("Error occured during refresh");
				}
			});	 */

		},

		onPress: function (event) {
			var itemId = event.getSource().getBindingContext().sPath.replace("/", "");
			this.getRouter().navTo("detail",  {transactionId : itemId});
		}
	});
});