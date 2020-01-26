sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/model/json/JSONModel",
	"sap/base/util/UriParameters",
	"sap/base/Log"
], function (MockServer, JSONModel, UriParameters, Log) {
	"use strict";

	var oMockServer;
	var _sAppPath = "sap/ui/demo/basicTemplate/";
	var _sJsonFilesPath = _sAppPath + "localService/mockdata";

	var oMockServerInterface = {

		init : function (optionsParameter){
			return new Promise( (resolve, reject) => {
				let requests =  [];
				const templateReader = new JSONModel();

				templateReader.loadData(sap.ui.require.toUrl(_sJsonFilesPath + "/transactions.json"));

				templateReader.dataLoaded()
				.then( () => {
					requests.push({
						method: "GET",
						path: new RegExp("(.*)/api/v1/Transactions"),
						response: function(oXhr) {
							oXhr.respondJSON(200, {}, templateReader.getJSON());
							return true;
						}
					});

					requests.push({
						method: "POST",
						path: new RegExp("(.*)/api/v1/Transactions"),
						response: function(oXhr) {
							oXhr.respondJSON(204);
							return true;
						}
					});

					requests.push({
						method: "POST",
						path: new RegExp("(.*)/api/v1/Add2DB"),
						response: function(oXhr) {
							templateReader.oData[templateReader.oData["length"]] = JSON.parse(oXhr.requestBody);
							oXhr.respondJSON(204);
							return true;
						}
					});

					var mockServer = new MockServer({
						rootUri: "/backend",
						requests: requests
					});

					mockServer.start();
					resolve();
				}).catch(e => {
					Log.error(e);
					var errorMsg = "Failed to load mock data for templates";
					reject(new Error(errorMsg));
				});

			});
		},

		/**
		 * @public returns the mockserver of the app, should be used in integration tests
		 * @returns {sap.ui.core.util.MockServer} the mockserver instance
		 */
		getMockServer : function () {
			return oMockServer;
		}
	};

	return oMockServerInterface;
});