
angular.module('nvd.services',[]).factory('nvdProcessor', ['$rootScope', 'nowServer', '$http', '$timeout', '$q', function($rootScope, nowServer, $http, $timeout, $q) {
	'use strict';
	return {
		changed: false,
		records: [],
		nvdRecords:[],
		listener: null,
		
		getNVDRecords: function (){
			var self = this;
			var promise = $q.defer();
			$http.post("/api/sn_vul/nvd_processor/load_nvd").success(function(response) {
				promise.resolve(response.result.NVDRecords);
				self.nvdRecords = response.result.NVDRecords;
			});
			return promise.promise;
		},
		
		updateNVDRecord: function(sys_id,state,entries_imported,active){
			$http.post("/api/sn_vul/nvd_processor/update_nvd", {sys_id:sys_id, state: state, entries_imported:entries_imported, active:active}).success(function(response) {
				return response.toString();
			});
		},
			
		checkNVDRefreshStatus: function() {
			var self = this;
			var promise = $q.defer();
			$http.post("/api/sn_vul/nvd_processor/refreshNVD").success(function(response) {
				promise.resolve(response.result.NVDRecords);
				self.nvdRecords = response.result.NVDRecords;
				self.job_running = response.result.job_running;
			});
			return promise.promise;
		},
		
	}
}]);