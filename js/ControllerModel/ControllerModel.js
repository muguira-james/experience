

mvc.controller = {

  zoomChanged: function(e) {

    z = map.getZoom();
    console.log("map zoom changed", z);

    mvc.ViewModel.setZoomLevel(z);

    if (z <=15) {
      mvc.ViewModel.setCurrentView(CurrentViewId.COURSE_VIEW);
      mvc.ViewModel.update();
    };
    if (z === 17) {
      mvc.ViewModel.setCurrentView(CurrentViewId.DEFAULT_VIEW);
      mvc.ViewModel.update();
    }
  },

  markerclick: function(evt, infoObject) {
      console.log("Zname " + infoObject.name);
      mvc.ViewModel.setCurrentView(infoObject.holeType2Draw);
      mvc.ViewModel.setMapCenter(preferences.TrumpNationLatLng);
      preferences.currentHole2Draw = infoObject.currentHole;
      //console.log("ctl -------->", infoObject);
      mvc.ViewModel.update();
  },

  registerView: function() {
    map.addListener('zoom_changed', function(e) {
      mvc.controller.zoomChanged();
    });
  },

  register: function(marker, infoObject) {
    marker.addListener('click', function(evt) {
      mvc.controller.markerclick(evt, infoObject);
    });

  }
}
