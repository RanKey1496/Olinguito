angular.module('olinguito')
.controller('AuthController', function($auth, $http, $state, $rootScope){
	var vm = this;

	vm.authError = false;
	vm.authErrorText;

	vm.login = function(){
		var credentials = {
			email: vm.email,
			password: vm.password
		}

		$auth.login(credentials).then(function(){
			return $http.get('https://olinguitoapi.herokuapp.com/authenticated');
		}, function(err){
			vm.authError = true;
			vm.authErrorText = err;
		}).then(function(res){
			if(res){
				var user = JSON.stringify(res.data.message);
				localStorage.setItem('user', user);
				$rootScope.authenticated = true;
				$rootScope.currentUser = res.data.message;
				$state.go('private');
			}
		})
	};

	vm.register = function(){
		var credentials = {
			email: vm.email,
			password: vm.password,
			first: vm.firstname,
			last: vm.lastname
		}

		$auth.signup(credentials).then(function(res){
			return res;
		})
		.catch(function(res){
			vm.authError = true;
			vm.authErrorText = res;
		});
	}
})
.controller('HomeController', function($state){
	var vm = this;
	vm.lul = 'Jerry Chino marica';
	vm.avatar = 'http://wfarm2.dataknet.com/static/resources/icons/set3/c9f1cdf473a8.png';
	vm.imagen = 'http://www.desmotivar.com/img/desmotivaciones/174_michelin_chino.jpg';
	vm.swag = 'Una descripcion con un p';
	vm.swag2 = 'Descripción con un span';

	vm.login = function(){
		$state.go('login');
	};

	vm.register = function(){
		$state.go('register');
	};
})
.controller('PrivateController', function($auth, $rootScope, $state){
	var vm = this;
	vm.user;
	vm.error;

	vm.title = 'Ventana Privada'
	vm.mensajeprueba = 'Jerry si no estás logueado no te dejará entrar';

	vm.logout = function(){
		$auth.logout().then(function(){
			localStorage.removeItem('user');
			$rootScope.authenticated = false;
			$rootScope.currentUser = null;
			$state.go('login');
		})
	}
});