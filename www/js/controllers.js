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

		$auth.login(credentials)
			.then(function(res){
				return $http.get('http://olinguitoapi.herokuapp.com/authenticated')
						.success(function(res){
							console.log(res);
							var user = JSON.stringify(res.message);
							localStorage.setItem('user', user);
							$rootScope.authenticated = true;
							$rootScope.currentUser = res.message;
							$state.go('private');
						})
						.error(function(err){
							vm.authError = true;
							vm.authErrorText = err.message;
						});
			});
	};

	vm.register = function(){
		var credentials = {
			email: vm.email,
			password: vm.password,
			firstname: vm.firstname,
			lastname: vm.lastname
		}

		$auth.signup(credentials).then(function(res){
			$state.go('login');
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
.controller('PrivateController', function($auth, $rootScope, $state, $cordovaImagePicker, $ionicPlatform){
	var vm = this;
	vm.user;
	vm.error;

	vm.title = 'Ventana Privada'
	vm.mensajeprueba = 'Jerry si no estás logueado no te dejará entrar';

	vm.collection = {
		selectedImage: ''
	}

	$ionicPlatform.ready(function(){
		vm.getImageSaveContact = function(){
			var options = {
		        maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
		        width: 800,
		        height: 800,
		        quality: 80           // Higher is better
	    	};

	    	$cordovaImagePicker.getPictures(options).then(function(res){
	    		for (var i = 0; i < res.length; i++) {
	            	console.log('Image URI: ' + res[i]);   // Print image URI
	        	}
	        	window.plugins.Base64.encodeFile($scope.collection.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
                    vm.collection.selectedImage = base64;
                });
	    	}, function(err){
	    		console.log(err)
	    	});
		};
	});
	

	vm.logout = function(){
		$auth.logout().then(function(){
			localStorage.removeItem('user');
			$rootScope.authenticated = false;
			$rootScope.currentUser = null;
			$state.go('login');
		})
	}
});