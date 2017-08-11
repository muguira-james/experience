

mvc.controller = {

 zoomChanged: function(e) {

   // this does not call update - that sets the app to spinning!!!
   var radius = mvc.ViewModel.getPlayerIconRadius();
   var zoom = map.getZoom();
   var zoomLevel = mvc.ViewModel.getZoomLevel();

   switch (zoom) {
     case 20: { radius = 0.005; break; }
     case 19:
     case 18: { radius = 0.007; break; }
     case 17:
     case 16:
     case 15:
     case 14: { radius = 0.04; break; }
   };
   mvc.ViewModel.playerIconRadius = radius;

   if (zoom === 15) {
     mvc.ViewModel.setCurrentView(CurrentViewId.COURSE_VIEW);
     mvc.ViewModel.update();
   };

   if ((zoom === 16) && (zoomLevel === 15)) {
     mvc.ViewModel.setCurrentView(CurrentViewId.DEFAULT_VIEW);
     mvc.ViewModel.update();
   }

   mvc.ViewModel.setZoomLevel(zoom);
   console.log("map zoom changed", zoom, "zlevel", mvc.ViewModel.getZoomLevel(), "view", mvc.ViewModel.getCurrentView());
 },

 playerClick: function(evt, infoObject) {
     console.log("Zname " + infoObject.name, infoObject.holeType2Draw);

     mvc.ViewModel.setCurrentView(infoObject.holeType2Draw);
     mvc.ViewModel.setMapCenter(infoObject.position);
     preferences.position = infoObject.position;
     preferences.currentHole2Draw = infoObject.currentHole;

     mvc.ViewModel.deleteOverlays();

     map.setZoom(19);
     mvc.ViewModel.setZoomLevel(19);
     console.log("pref (c) hole 2 draw", infoObject);
     map.panTo(infoObject.position);


     mvc.ViewModel.drawAllPlayersAtAHole(infoObject.currentHole);
 },

 flagClick: function(evt, infoObject) {
   // deleteOverlays, drawAllPlayersAtAHole
   mvc.ViewModel.deleteOverlays();
   mvc.ViewModel.zoomToHole(infoObject.currentHole);
   console.log("pref hole 2 draw", preferences.currentHole2Draw)
   mvc.ViewModel.drawAllPlayersAtAHole(infoObject.currentHole);
   mvc.ViewModel.drawFlags();
   mvc.ViewModel.zeeLoc(infoObject.currentHole);
 },

 registerView: function() {
   map.addListener('zoom_changed', function(e) {
     mvc.controller.zoomChanged();
   });
 },

 playerRegister: function(marker, infoObject) {
   marker.addListener('click', function(evt) {
     mvc.controller.playerClick(evt, infoObject);
   });

 },
 registerFlag: function(flag, infoObject) {
   flag.addListener('click', function(evt) {
     mvc.controller.flagClick(evt, infoObject);
   });
 }
}
