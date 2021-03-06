var app = angular.module('Dashboard', []);

app.factory('socket',function(){
	var socket = io.connect('http://10.102.0.15:3001');
	return socket;
});

app.controller('DatosNowCtrl', ['$scope','socket','$http', function($scope,socket,$http) {


	/*Variables*/
	$scope.data = {
		date: '12 NOV',
		in : 0,
		in_total : 0,
		calls : 0,
		sells: 0,
		consecionario:{
			name: '--',
			units: 0
		},
		seller:{
			name: '--',
			units: 0
		},
		car_sell:{
			name: '--',
			units: 0
		},
		car_call:{
			name: '--',
			units: 0
		}
	}
	$scope.cars = [];
	$scope.car_sells = [];
	$scope.sellers = [];

	socket.on('actualizacion_dashboard', function (data) {
		console.log(data);

		/*

		*/
		$scope.cars = data.adicionales;
		$scope.car_sells = data.adicionales_ventas;
		$scope.sellers = data.vendedor_ventas_ranking;
		$scope.data = {
			in : data.dashboard.enter - data.dashboard.out,
			in_total : data.dashboard.enter,
			calls : data.dashboard.calls,
			sells: data.dashboard.total_sells,
			consecionario:{
				name: data.dashboard.concesionario_ventas ? data.dashboard.concesionario_ventas.name : '--',
				units: data.dashboard.concesionario_ventas ? data.dashboard.concesionario_ventas.units : '--'
			},
			seller:{
				name: data.dashboard.vendedor_ventas ? data.dashboard.vendedor_ventas.name : '--',
				units: data.dashboard.vendedor_ventas ? data.dashboard.vendedor_ventas.units :'--'
			},
			car_sell:{
				name: data.dashboard.carro_vendido ? data.dashboard.carro_vendido.name : '--',
				units: data.dashboard.carro_vendido ? data.dashboard.carro_vendido.units : '--'
			},
			car_call:{
				name: data.dashboard.carro_consultado ? data.dashboard.carro_consultado.name : '--',
				units: data.dashboard.carro_consultado ? data.dashboard.carro_consultado.units : '--'
			}
		}

		$scope.$digest();

	});


	/*Init*/
	$http.get('/dashboard/datos_now').
		success(function(data, status, headers, config) {
			console.log(data);

			$scope.data = {
				in : data.enter - data.out,
				in_total : data.enter,
				calls : data.calls,
				sells: data.total_sells,
				consecionario:{
					name: data.concesionario_ventas ? data.concesionario_ventas.name : '--',
					units: data.concesionario_ventas ? data.concesionario_ventas.units : '--'
				},
				seller:{
					name: data.vendedor_ventas ? data.vendedor_ventas.name : '--',
					units: data.vendedor_ventas ? data.vendedor_ventas.units : '--'
				},
				car_sell:{
					name: data.carro_vendido ? data.vendedor_ventas.name : '--',
					units: data.carro_vendido ? data.carro_vendido.units : '--'
				},
				car_call:{
					name: data.carro_consultado ? data.carro_consultado.name : '--',
					units: data.carro_consultado ? data.carro_consultado.units : '--' 
				}
			}

		  // this callback will be called asynchronously
		  // when the response is available
		}).
		error(function(data, status, headers, config) {
		  // called asynchronously if an error occurs
		  // or server returns response with an error status.
		});

	/*Events*/

	/*Functions*/

}]);
