

mvc.ViewModel = {

   // _zoomLevel is an integer between 14 and 18
   _zoomLevel: 14,
   getZoomLevel: function() { return this._zoomLevel; },
   setZoomLevel: function(z) {
     if ((z > 14) && (z < 21)) {
         this._zoomLevel = z;
     }
   },

   // this is a huristic for how far to place icons apart
   // so they look good (no overlap, etc)
   playerIconRadius: 0.04,
   getPlayerIconRadius: function() {
     return this.playerIconRadius;
   },
   setPlayIconRadius: function(r) {},

   // lat lng of the center of the map
   _mapCenter: {},
   getMapCenter() { return this._mapCenter; },
   setMapCenter(c) {
     this._mapCenter = c;
   },

   // holds the current view.  Views should be draw from the
   // info contained in the model dir
   _currentViewId: CurrentViewId.DEFAULT_VIEW,
   getCurrentView: function() {
     return this._currentViewId;
   },
   setCurrentView: function(v) {
     // stupid way to edit the method input, maybe?
     switch(v) {
       case CurrentViewId.DEFAULT_VIEW: {
         this._currentViewId = CurrentViewId.DEFAULT_VIEW;
         break;
       }
       case CurrentViewId.COURSE_VIEW: {
         this._currentViewId = CurrentViewId.COURSE_VIEW;
         break;
       }
       case CurrentViewId.DETAIL_VIEW: {
         this._currentViewId = CurrentViewId.DETAIL_VIEW;
         break;
       }
       default: {
         var er = "ERROR: setCurrentView: input is not part of the enum definition!!!";
         console.log(er, v);
       }
     }
   },

   update: function() {
     mvc.ViewModel.DrawView();
   },

   DrawView: function() {

     var v = this.getCurrentView();
     switch(v) {
       case CurrentViewId.DEFAULT_VIEW: {
         this.DrawDefaultView();
         break;
       }
       case CurrentViewId.COURSE_VIEW: {
         this.DrawCourseView();
         break;
       }
       case CurrentViewId.DETAIL_VIEW: {
         this.DrawDetailView();
         break;
       }
       default: {
         console.log("ERROR: DrawView: input is not part of the enum definition!!!");
       }
     }
   },

   // creates the google map instance
   initMap: function() {

     //var uluru = mvc.ViewModel.getMapCenter();
     // var uluru = this._mapCenter;
     var uluru = this.getMapCenter();

     map = new google.maps.Map(document.getElementById('mapid'), {
       zoom: 15,
       mapTypeId: 'satellite',
       center: uluru,
       minZoom: 15,
       maxZoom: 20
     });

     // // this is our gem
     // google.maps.event.addDomListener(window, "resize", function() {
     //     var center = map.getCenter();
     //     google.maps.event.trigger(map, "resize");
     //     map.setCenter(center);
     // });
   },

   clickFunc: function (evt) {
     console.log(evt);
   },

   addFlag: function(latlng, id) {
     pixelSize = preferences.flagSize;
     // var zoom = map.getZoom();
     // relativePixelSize = Icon2ZoomSize(zoom);
     //console.log("Rel Pix", relativePixelSize);
     var image = {
       url: id.photo,
       // size: new google.maps.Size(400, 320),
       anchor: new google.maps.Point(1, preferences.flagAnchorPoint),
       scaledSize: new google.maps.Size(pixelSize,pixelSize)
     }

     var flag = new google.maps.Marker({
       position: latlng,
       icon: image,
       map: map
     });
     mvc.controller.registerFlag(flag, id);
     markersArray.push(flag);
     //console.log("addMarker",latlng);

   },

   addPlayer: function (latlng, id) {
     pixelSize = preferences.markerIconScaled;
     var zoom = map.getZoom();
     relativePixelSize = Icon2ZoomSize(zoom);
     console.log("Rel Pix", pixelSize);
     var image = {
       url: id.photo,
       // size: new google.maps.Size(400, 320),
       anchor: preferences.markerIconAnchorSize,
       scaledSize: new google.maps.Size(relativePixelSize,relativePixelSize)
     }

     var playerMarker = new google.maps.Marker({
       position: latlng,
       icon: image,
       map: map
     });
     mvc.controller.playerRegister(playerMarker, id);
     markersArray.push(playerMarker);
     //console.log("addMarker",latlng);
   },

   addFan: function (latlng, id) {
     //pixelSize = preferences.markerIconScaled;
     //var zoom = map.getZoom();
     //relativePixelSize = Icon2ZoomSize(zoom);
     //console.log("Rel Pix", pixelSize);
     var image = {
       url: id.photo,
     }

     var fanMarker = new google.maps.Marker({
       position: latlng,
       icon: image,
       map: map
     });
    //  mvc.controller.playerRegister(playerMarker, id);
    //  markersArray.push(playerMarker);
     //console.log("addMarker",latlng);
   },
   // removes overlays from the map
   clearOverlays: function () {
     if (markersArray) {
       for (i=0; i<markersArray.length; i++) {
         markersArray[i].setMap(null);
       }
     }
   },

   // Shows any overlays currently in the array
   showOverlays: function () {
     if (markersArray) {
       for (i=0; i<markersArray.length; i++) {
         markersArray[i].setMap(map);
       }
     }
   },

   // Deletes all markers in the array by removing references to them
   deleteOverlays: function () {
     if (markersArray) {
       for (i=0; i<markersArray.length; i++) {
         markersArray[i].setMap(null);
       }
       markersArray.length = 0;
     }
   },

   deleteLayerOverlays: function() {
     console.log(map.data.length);
     map.data.forEach(function(feature) {
      //filter...
       map.data.remove(feature);
});

     // if (layersArray) {
     //   for (j=0; j<layersArray.length; j++) {
     //     //console.log(layersArray[j]);
     //     var it = layersArray[j];
     //     console.log(it, it.getType());
     //     //map.data.remove();
     //   }
     //   layersArray.length = 0;
     // }
   }

}
