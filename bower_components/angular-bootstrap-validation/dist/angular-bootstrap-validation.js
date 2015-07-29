(function() {
  var validatorFn = function($timeout) {
    var DIRTY_CLASS = 'ng-valid';
    var VALID_CLASS = 'ng-valid';
    var INVALID_CLASS = 'ng-invalid';
    var SUCCESS_CLASS = 'has-success';
    var ERROR_CLASS = 'has-error';
    var OK_CLASS = 'glyphicon-ok';
    var REMOVE_CLASS = 'glyphicon-remove';
    return function(scope, element, isOK) {
      $timeout(function() {
        var input = element.find('input');
        if (!input.length) {
          input = element.find('select');
        }
        if (!input.length) {
          input = element.find('textarea');
        }
        if (input.length) {
          var icon = element.find('span');
          if (isOK) {
            scope.$watch(function() {
              return input.hasClass(VALID_CLASS);
            }, function(isValid) {
              element.toggleClass(SUCCESS_CLASS, isValid);
              if (icon.length) {
                icon.toggleClass(OK_CLASS, isValid);
              }
            });
          } else {
            scope.$watch(function() {
              return input.hasClass(INVALID_CLASS) && input.hasClass('ng-dirty');
            }, function(isValid) {
              element.toggleClass(ERROR_CLASS, isValid);
              if (icon.length) {
                icon.toggleClass(REMOVE_CLASS, isValid);
              }
            });
          }
        }
      });
    }
  };

  var successDirectiveFn = function(bsProcessValidator) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        if (element[0].nodeName.toLowerCase() === 'form') {
          element.find('.form-group').each(function(i, formGroup) {
            bsProcessValidator(scope, angular.element(formGroup), true);
          });
        } else {
          bsProcessValidator(scope, element, true);
        }

      }
    }
  };

  var errorDirectiveFn = function(bsProcessValidator) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        if (element[0].nodeName.toLowerCase() === 'form') {
          element.find('.form-group').each(function(i, formGroup) {
            bsProcessValidator(scope, angular.element(formGroup), false);
          });
        } else {
          bsProcessValidator(scope, element, false);
        }

      }
    }
  };

  var mainDirectiveFn = function(bsProcessValidator) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        if (element[0].nodeName.toLowerCase() === 'form') {
          $(element[0]).find('.form-group').each(function(i, formGroup) {
            bsProcessValidator(scope, angular.element(formGroup), true);
            bsProcessValidator(scope, angular.element(formGroup), false);
          });
        } else {
          bsProcessValidator(scope, element, true);
          bsProcessValidator(scope, element, false);
        }

      }
    }
  };

  /**
   * @ngdoc module
   * @name Bootstrap Validation
   *
   * @description
   * Directives to apply bootstrap form classes on angular models
   *
   * You can either apply it to .form-group or to parent form
   *
   * This module was mainly written by SO users, see here: http://stackoverflow.com/questions/14348384/reconcile-angular-js-and-bootstrap-form-validation-styling
   */
  angular
    .module('bs-validation', [])
    .factory('bsProcessValidator', ['$timeout', validatorFn])
    .directive('bsHasSuccess', ['bsProcessValidator', successDirectiveFn])
    .directive('bsHasError', ['bsProcessValidator', errorDirectiveFn])
    .directive('bsHas', ['bsProcessValidator', mainDirectiveFn]);
})();
