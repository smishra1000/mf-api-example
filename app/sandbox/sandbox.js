'use strict';

angular.module('mfApiExampleApp').controller('SandboxCtrl', function($scope, $http, $filter) {

    var baseUrl = 'http://10.0.1.2:6500';
    var formatFilter = $filter('format');
//    var tokenRegEx = /(\:\w+)(\/{0,1})/gi;
    var tokenRegEx = /(\:)(\w+)(\/{0,1})/gi;


	$scope.apiList = [
		{ name: 'Authorize user', type: 'GET', url: '/api/:version/auth/loginUser' },
		{ name: 'Add users', type: 'POST', url: '/api/:version/user',
            query: {'users': [], 'requiredCourseIds': [], 'courseIds': [], 'seriesIds': [], 'groupIds': [], 'clientDatestamp': ''} },
		{ name: 'Archive user', type: 'POST', url: '/api/:version/user/:userId/archive' },
		{ name: 'Invite a trainee to a course', type: 'POST', url: '/api/:version/user/:userId/course/:courseId/invite' },
		{ name: 'Invite trainees to a course', type: 'POST', url: '/api/:version/course/:courseId/invite' },
		{ name: 'courseTraineesAndStatuses', type: 'GET', url: '/api/:version/course/:courseId/user' },
		{ name: 'getCourses', type: 'GET', url: '/api/:version/course' },
		{ name: 'inviteTraineeToSeries', type: 'POST', url: '/api/:version/user/:userId/series/:seriesId/invite' },
		{ name: 'inviteTraineesToSeries', type: 'POST', url: '/api/:version/series/:seriesId/invite' },
		{ name: 'courseTraineesAndStatuses', type: 'GET', url: '/api/:version/series/:seriesId/user' }
	];


//    req.assert('users').arrayNotEmpty();
//    req.assert('requiredCourseIds').isIntOrEmptyArray();
//    req.assert('courseIds').isIntOrEmptyArray();
//    req.assert('seriesIds').isIntOrEmptyArray();
//    req.assert('groupIds').isIntOrEmptyArray();
//    req.assert('clientDatestamp').notEmpty().regex(/\d{4}\-\d{1,2}\-\d{1,2}/g); // 2013-6-24 or 2013-12-24


    $scope.items = ['v2'];

	$scope.currentApi = null;

	$scope.viewModel = {
        keySaved: false
	};

    $scope.resultInfo = {};

    $scope.apiModel = {
        apiKey: '',
        version: 'v2'
    };

    function initialize() {
//        $scope.currentAPI = $scope.apiList[0];
        // populate the tokens
        _.each($scope.apiList, function(item) {
            item.tokens = getMatches(item.url, tokenRegEx, 2);
        });

        // for testing
        $scope.currentApi = $scope.apiList[7];
        $scope.currentRepeater = angular.copy($scope.currentApi.tokens);

        $scope.apiModel.apiKey = '32bbb158dbd24c3f853aed577b415dc0';
        $http.defaults.headers.common['x-mindflash-apikey'] = $scope.apiModel.apiKey;
        $scope.viewModel.keySaved = true;
    }

    $scope.enterApiInfo = function(type) {
        if(type == 'edit') {
            $scope.viewModel.keySaved = false;
            return;
        }
        if(!$scope.apiModel.apiKey) return;

        $scope.viewModel.keySaved = true;
        $http.defaults.headers.common['x-mindflash-Apikey'] = $scope.apiModel.apiKey;
    };

	$scope.selectApi = function(api) {
		$scope.resultInfo = {};
		$scope.currentApi = api;
        $scope.currentRepeater = angular.copy($scope.currentApi.tokens);
	};

	$scope.sendCall = function() {
        var formattedUrl = formatFilter($scope.currentApi.url, $scope.currentApi.tokens);
		$http({method: 'GET', url: (baseUrl + formattedUrl)}).
			success(function(data, status, headers, config) {
                $scope.resultInfo.data = data;
                $scope.resultInfo.status = status;
			}).
			error(function(data, status, headers, config) {
                $scope.resultInfo.data = data;
                $scope.resultInfo.status = status;
			});
	};

    $scope.navClass = function(api) {
        return {
            last: this.$last,
            active: $scope.currentApi == api
        };
    };

    $scope.$on('$destroy', function() {

	});


//    function getMatches(string, regex, index) {
//        index || (index = 1); // default to the first capturing group
//        var matches = [];
//        var match;
//        while (match = regex.exec(string)) {
//            console.log(match);
//            matches.push(match[index]);
//        }
//        return matches;
//    }

    function getMatches(string, regex, index) {
        index || (index = 1); // default to the first capturing group
        var matches = {};
        var match;
        while (match = regex.exec(string)) {
            matches[match[index]] = '';
        }
        return matches;
    }

    initialize();
});
