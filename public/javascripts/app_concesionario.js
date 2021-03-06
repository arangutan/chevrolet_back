var app = angular.module('Concesionarios', []);

app.factory('socket',function(){
  var socket = io.connect('http://10.102.0.15:3001');
  return socket;
});

app.filter('validad_concecionario',function () {
  return function(concecionario){
    return concecionario != null ? concecionario : 'No tiene aun asignado' ;
  }
});

app.directive('validarOcupado', function($compile) {


  var btn = '<div class="button">Aceptar cita</div>';
  var concesionario = '<p class="text-center">Cita ya aceptada por {{content.concesionario.name}}</p>';


  var linker = function(scope, element, attrs) {

    if (scope.content.concesionario != null) {
      element.html(concesionario).show();
      $compile(element.contents())(scope);
    }else{
      element.html(btn).show();
    }

  }

  return {
    restrict: 'E',
    link: linker,
        scope: {
            content:'='
        }
    };
});


app.controller('AgendaConcesionarioCtr', ['$scope','socket','$http', function($scope,socket,$http) {

    $scope.agendas = [];
    $scope.id_consecionario = '';

    $scope.fecha = '11-17-2014';

    /*Init*/
    $http.get('/vendedor/agenda_concesionario/'+$scope.fecha).
      success(function(data, status, headers, config) {
        //console.log(data);
        $scope.agendas = data.agenda;

        // this callback will be called asynchronously
        // when the response is available
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

    /*Events*/
    $scope.solicitar_hora =  function (item_agenda) {
      if (item_agenda.concesionario == null) {
        //console.log($scope.id_consecionario);

        var obj = {
          id_agenda : item_agenda._id,
          id_concecionario : angular.element('#id_conce').html().trim(),
          fecha : $scope.fecha
        }

        socket.emit('seleccionar_hora_atender',obj);

      }else {
        alert('esta hora ya fue asignada');
      }
    }

    /*Functions*/
    socket.on('notify_concesionario', function (data) {
        console.log(data);
        $scope.agendas = data;

        $scope.$digest();

    });
}]);
