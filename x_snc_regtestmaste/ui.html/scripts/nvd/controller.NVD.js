angular.module('nvd.controllers', [])
		.controller('nvd_MainCtrl',

	function($scope, nvdProcessor,$interval) {
		'use strict';
		$scope.NVDRecords = [];
		$scope.job_running = "false";
		$scope.checksAreDisabled = false;
		$scope.initialize = function() {
			setupStatusInterval();
		};

		$scope.getRecordCount = function() {
			// The service may not provide all the functionality we need
			// But neither do we want to bloat the service with functions that may
			// only be used in one place
			if (nvdProcessor.getRecords())
				return nvdProcessor.getRecords().length;
			else
				return 0;
		};
		
		$scope.getNVDRecords = function() {
			nvdProcessor.getNVDRecords().then(function(data){
				$scope.NVDRecords = data;
			});
		};
		
		$scope.refreshNVDs = function() {
			$scope.nvdsToRefresh = [];
			if($scope.checksAreDisabled) 
				return false;
			
			for(var key in $scope.NVDRecords) {
				 if($scope.NVDRecords[key].checked){
					 $scope.nvdsToRefresh.push($scope.NVDRecords[key].sys_id);
					 var recordUpdate = nvdProcessor.updateNVDRecord($scope.NVDRecords[key].sys_id,"queued","0","true"); //sys_id,state,entries_imported,active
				 } else
				 	 nvdProcessor.updateNVDRecord($scope.NVDRecords[key].sys_id,"","","false"); //sys_id,state,entries_imported,active
			}
			
			if ($scope.nvdsToRefresh.length === 0)
				return;
			
			$scope.job_running = "true";
			
			setupStatusInterval();
		};

		$scope.fetchStatusCall = function() {
			nvdProcessor.checkNVDRefreshStatus().then(function(data) {
				$scope.NVDRecords = data;
				$scope.job_running = nvdProcessor.job_running;
				if($scope.job_running === "false") {
					if ($scope.statusInterval) {
						$interval.cancel($scope.statusInterval);
					}
				}
			});
		};
		
		$scope.checkDisable = function() {
			if($scope.job_running == "false")
				return "";
			else
				return "disabled";
		};
		
		$scope.getClass = function(index) {
			if (index % 2 == 0)
				return "list_even";	
			else
				return "list_odd";
		};

		var setupStatusInterval = function() {
			$scope.fetchStatusCall();
			if ($scope.statusInterval) {
				$interval.cancel($scope.statusInterval);
			}
			$scope.statusInterval = $interval($scope.fetchStatusCall, 2000);
		};
	});