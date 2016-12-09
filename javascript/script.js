/**
 * Created by AfzalAhmad on 12/8/2016.
 */
//I have used NodeJS to retrieve Images, Although I could have use jQuery or custom script
(function(){
    var app = angular.module("editor",[]);
    //imageListController to retrieve images from server, this script only works if server is already in running state
    app.controller('imageListController',function($window,$http){
        var self = this;
        //array object which will contain images
        self.images = [];
        //retrieve image function
        self.retrieveImage = function(){
            $http({method:'GET',url:'/images'}).then(function(response){
                // console.log(response);
                var arr = response.data;
                arr.forEach(function(x){
                    if(self.images.indexOf(x) === -1){
                        self.images.push(x)
                    }
                });
            });
        };
        //making getImage a global function so that we can call it on demand
        $window.getImages = self.retrieveImage;
    });
})();