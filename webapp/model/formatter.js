sap.ui.define([], function () {
	"use strict";
	return {
		
		formatName: function(value){
			if (!value) {
				return "";
			}

			return value.toUpperCase();
		}

	};
});