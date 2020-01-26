sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function(BaseController, formatter, MessageToast, JSONModel, Fragment) {
	"use strict";

	return BaseController.extend("sap.ui.demo.basicTemplate.controller.App", {

		formatter: formatter,

		onInit: function () {
			var oAddItemModel = new JSONModel({
				"name": "",
				"price": 0,
				"amount": 0,
				"id": 0,
				"ordered": 0,
				"ingredients": "" 
			});

			this.setModel(oAddItemModel, "addItemModel");
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
		},

		_openDialog : function () {
			var oView = this.getView();

			// create dialog lazily
			if (!this._addDialog) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "sap.ui.demo.basicTemplate.view.AddItemDialog",
					controller: this
				}).then(oDialog => {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
					this._addDialog = oDialog;
				});
			} else {
				this._addDialog.open();
			}
		},

		onPressAddItem: function () {
			this._openDialog();	
		},

		onPressItemCancel: function () {
			if (this._addDialog) {
				this._addDialog.close();
			}
		},

		onPressPushNewItem:function (event) {
			var data = JSON.parse(this.getModel().getJSON());
			var newdata = JSON.parse(this.getModel("addItemModel").getJSON());
			newdata.id = data.length;
			$.ajax({
				url: "/backend/api/v1/Add2DB",
				method: "POST",
				contentType: "application/json",
				data: JSON.stringify(newdata),
				success: () => {
					MessageToast.show("successfully added to DB", {
						closeOnBrowserNavigation: false 
					});
					this._addDialog.close();
					this.onRefresh();
				},
				error: function (e) {
					MessageToast.show("Error happened")
				}
			});	
		}
	});
});