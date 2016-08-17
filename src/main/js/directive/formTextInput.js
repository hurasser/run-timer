angular.module('runTimer').directive('formTextInput', [function() {
	return {
		templateUrl : 'templates/form-text-input.html',
		restrict : 'A',
		scope : {
			placeholder: '@',
			model: '=',
			canSubmit: '&',
			submit: '&'
		},
		link : function(scope, elem, attrs) {
			scope.inputType = 'password' in attrs ? "password" : "text";
			
			scope.handleEnterPress = function() {
				if (scope.canSubmit && scope.canSubmit() && scope.submit) {
					scope.submit();
				}					
			};
			
			scope.handleFocus = function($event) {
				$event.stopPropagation();
				if (scope.focus) return;
				scope.focusMe = true;
			}
		}
	}
}]);
