angular.module('olinguito', ['ionic', 'satellizer'])
.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide){
  function redirectWhenLoggedOut($q, $injector){
    return {
        responseError: function(rejection){
        var $state = $injector.get('$state');
        var rejectionReasons = ['Invalid token format', 
        'No Authorization header was found', 
        'Invalid token format', 
        'JsonWebTokenError', 
        'TokenExpiredError'];

        angular.forEach(rejectionReasons, function(value, key){
          if(rejection.data.message == value || rejection.data.message.name == value){
            localStorage.removeItem('user');
            $state.go('auth');
          }
        });

        return $q.reject(rejection);
      }
    }
  };

  $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
  $httpProvider.interceptors.push('redirectWhenLoggedOut');

  $authProvider.loginUrl = 'https://olinguitoapi.herokuapp.com/signin';
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'AuthController as auth'
    })
    .state('register', {
      url: '/register',
      templateUrl: '../templates/register.html',
      controller: 'AuthController as auth'
    })
    .state('home', {
      url: '/home',
      templateUrl: '../templates/home.html',
      controller: 'HomeController as home'
    })
    .state('private', {
      url: '/private',
      templateUrl: '../templates/private.html',
      controller: 'PrivateController as private',//quitas la coma
      //Comentarea para que no haya que loguearse el comentareo de la linea para que sea privada
      //dejala así para que vayas modificando cosas
      //También quita el comentareo de arriba, necesita una ','
      authRequired: true
    });
})
.run(function($ionicPlatform, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('$stateChangeStart', function(event, toState){
    var user = JSON.parse(localStorage.getItem('user'));
    if(user){
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
      if(toState.name === "auth") {
        event.preventDefault();
        $state.go('home');
      }
    }
    if(toState.authRequired && !$rootScope.authenticated){
      event.preventDefault();
      $state.go('login');
    }
  });
})