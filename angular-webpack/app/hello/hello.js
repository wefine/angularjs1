export default angular.module("app.hello", [])
    .component('hello', {
        restrict: 'E',
        scope: {},
        template: require('./hello.html'),
        controllerAs: 'vm',
        controller: function () {
            var vm = this;

            vm.greeting = 'Hello Webpack!';
        }
    });