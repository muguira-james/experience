

mvc.ViewModel = {

    // _zoomLevel is an integer between 14 and 18
    _zoomLevel: 14,
    getZoomLevel: function() { return this._zoomLevel; },
    setZoomLevel: function(z) {
      if ((z > 14) && (z < 18)) {
          this._zoomLevel = z;
      }
    },

    // this is a huristic for how far to place icons apart
    // so they look good (no overlap, etc)
    playerIconRadius: 0.04,
    getPlayerIconRadius: function() {
      return this.playerIconRadius;
    },

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

      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        mapTypeId: 'satellite',
        center: uluru
      });

      var it = CurrentViewId.DEFAULT_VIEW;
      var co = CurrentViewId.properties[it].code;

      console.log(it, co);
    },

    clickFunc: function (evt) {
      console.log(evt);
    },

    addMarker: function (latlng, id) {
      var image = {
        url: id.photo,
        // size: new google.maps.Size(400, 320),
        anchor: new google.maps.Point(1, 39),
        scaledSize: new google.maps.Size(40,40)
      }

      var marker = new google.maps.Marker({
        position: latlng,
        icon: image,
        map: map
      });
      mvc.controller.register(marker, id);
      markersArray.push(marker);
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
    }

}
