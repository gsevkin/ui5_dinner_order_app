sap.ui.define([
	"sap/ui/demo/basicTemplate/localService/mockserver",
	"sap/m/MessageBox"
], function (mockserver, MessageBox) {
	"use strict";

	var mockServerPr = mockserver.init();

	mockServerPr.catch(function (oError) {
		MessageBox.error(oError.message);
	}).finally(function () {
		// initialize the embedded component on the HTML page
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	});
}); 