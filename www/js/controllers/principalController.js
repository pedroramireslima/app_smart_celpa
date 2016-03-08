angular.module('smartq').controller('principalController', function($scope){

$scope.app={}
$scope.app.options = {
            visible: 5,
            perspective: 35,
            startSlide: 0,
            border: 3,
            dir: 'ltr',
            width: 200,
            height: 250,
            space: 120
        };

$scope.app.slides=[
            {src: 'img/photo2.jpg', caption: 'Lorem ipsum dolor'},
            {src: 'img/photo3.jpg', caption: 'Lorem ipsum dolor'},
            {src: 'img/photo4.jpg', caption: 'Lorem ipsum dolor'},
            {src: 'img/photo5.jpg', caption: 'Lorem ipsum dolor'},
            {src: 'img/photo6.jpg', caption: 'Lorem ipsum dolor'}
        ];



}
);