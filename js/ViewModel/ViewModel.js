
/**
* the global mvc object: mvc hold ViewModel and ControllerModel
*/
mvc.ViewModel = {

   /**
   *  _zoomLevel is an integer between 14 and 18
   */
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
   /**
   * the current view is a var defined in utils. This does not define "hole view"??
   */
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

   /**
   * was used to simply update the view.  Found that I needed more control over the state of the view
   * This is used in a few places.  In general, I've just started doing the setup for a view and calling
   * it (see DrawCourseView or the actions in the controller)
   */
   update: function() {
     mvc.ViewModel.DrawView();
   },

   /**
   * figure out which is the right view and draw it
   */
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

   /**
    *  creates the google map instance
    *
    * creates the google map object
    */
   initMap: function() {

     //var uluru = mvc.ViewModel.getMapCenter();
     // var uluru = this._mapCenter;
     var uluru = this.getMapCenter();

     map = new google.maps.Map(document.getElementById('mapid'), {
       zoom: 15,
       mapTypeId: 'satellite',
       center: uluru,
       mapTypeControl: false,
       minZoom: 15,
       maxZoom: 20
     });

     /* the following code may not be needed. I was experiementing with
     * catching map div resize events
     */
     // // this is our gem
     // google.maps.event.addDomListener(window, "resize", function() {
     //     var center = map.getCenter();
     //     google.maps.event.trigger(map, "resize");
     //     map.setCenter(center);
     // });
   },

   // just a test function not used
   clickFunc: function (evt) {
     console.log(evt);
   },

   /**
   * draw a flag on the map and make it so I can delete it later (markersArray.push())
   */
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
     // set an event listerner, if somebody clicks on this flag
     // jump to "hole View"
     mvc.controller.registerFlag(flag, id);
     markersArray.push(flag);
   },

   /**
   * add a player icon (ie. marker)  save it so I can delete it later
   */
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
     //
     // if somebody clicks on this player, jump to that player (center map, panTo)
     mvc.controller.playerRegister(playerMarker, id);
     markersArray.push(playerMarker);
   },

   /**
   * add the fan blue dot
   */
   addFan: function (latlng, id) {
     var image = {
       url: id.photo,
     }

     var fanMarker = new google.maps.Marker({
       position: latlng,
       icon: image,
       map: map
     });
    // the fan marker so I can delete it when I change views
    markersArray.push(fanMarker);
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

   // this might be wrong but: delete all the features from the map
   deleteLayerOverlays: function() {
     console.log(map.data.length);
     map.data.forEach(function(feature) {
      //filter...
       map.data.remove(feature);
     });
   }
}
