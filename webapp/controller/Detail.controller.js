sap.ui.define([
	"./BaseController",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function(BaseController, formatterVar, MessageToast, JSONModel, Fragment) {
	"use strict";

	return BaseController.extend("sap.ui.demo.basicTemplate.controller.Detail", {

		formatter: formatterVar,

		onInit: function () {
			var oViewModel = new JSONModel({
				isEmailValid: false
			});

			this.setModel(oViewModel, "viewModel");

			this.getRouter().getRoute("detail").attachPatternMatched(this._onTransactionMatched, this);
			// attachPatternMatched demek, patternMatched event var, o event emit edildiginde, benim bu fonksiyonu cagir.
		},

		_onTransactionMatched: function (event) {
			var transactionId =  event.getParameter("arguments").transactionId;

			// element binding
			this.getView().bindElement({
				path: "/" + transactionId
			});
		},

		onPressBtnBack: function (event) {
			var itemId = event.getSource().getBindingContext().sPath.replace("/", "");
			this.getRouter().navTo("home");
		},

		onPressBtnOrder: function () {
			this._openDialog();
		},

		_openDialog : function () {
			var oView = this.getView();

			// create dialog lazily
			if (!this._trDialog) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "sap.ui.demo.basicTemplate.view.OrderDialog",
					controller: this
				}).then(oDialog => {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
					this._trDialog = oDialog;
				});
			} else {
				this._trDialog.open();
			}
		},

		onEditOrder: function (event) {
			var data = this.getModel().getJSON();
			data = JSON.parse(data);
			var newOrderAmount = parseInt(this.getView().byId("newOrderVal").getValue());
			var newOrderID = parseInt(this.getView().byId("idOfItem").getValue()) - 1;			
			if (newOrderAmount > data[newOrderID].amount - data[newOrderID].ordered)
			{
				MessageToast.show("Cannot order more than remaining amount!", {
					closeOnBrowserNavigation: false 
				});
				this._trDialog.close();
				return;
			}

			data[newOrderID].ordered += newOrderAmount;

			$.ajax({
				url: "/backend/api/v1/Transactions",
				method: "POST",
				contentType: "application/json",
				data: JSON.stringify(data),
				success: () => {
					MessageToast.show("successfully ordered", {
						closeOnBrowserNavigation: false 
					});
					this._trDialog.close();
					this.getModel().loadData("/backend/api/v1/Transactions");
				},
				error: function (e) {
					MessageToast.show("Error happened")
				}
			});	
		},
		
		onEditCancel: function () {
			if (this._trDialog) {
				this._trDialog.close();
			}
		},

	});
});