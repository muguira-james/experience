/**
* define the controller models
*/

mvc.controller = {

  /**
  * when the zoom changes, change the radius that the player is drawn from the hole
  */
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

   /**
   * if the user tries to zoom out beyond 15, stop them.
   *
   * set the view at zoom = 15 and change the current view to Course view
   */
   if (zoom === 15) {
     mvc.ViewModel.setCurrentView(CurrentViewId.COURSE_VIEW);
     mvc.ViewModel.update();
   };

   /**
   * if the user changes from zoom level 15 DOWN TO zoom level 16
   * change the current view
   */
   if ((zoom === 16) && (zoomLevel === 15)) {
     mvc.ViewModel.setCurrentView(CurrentViewId.DEFAULT_VIEW);
     mvc.ViewModel.update();
   }

   // this re-enforces the zoom level
   mvc.ViewModel.setZoomLevel(zoom);
   console.log("map zoom changed", zoom, "zlevel", mvc.ViewModel.getZoomLevel(), "view", mvc.ViewModel.getCurrentView());
 },

 /**
 * react to a click on a player
 *
 * notice I do all the set and then draw the right view
 */
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

 /**
 * if a user clicks on a flag, do the setup and draw the hole view
 */
 flagClick: function(evt, infoObject) {
   // deleteOverlays, drawAllPlayersAtAHole
   mvc.ViewModel.deleteOverlays();
   mvc.ViewModel.zoomToHole(infoObject.currentHole);
   console.log("pref hole 2 draw", preferences.currentHole2Draw)
   mvc.ViewModel.drawAllPlayersAtAHole(infoObject.currentHole);
   mvc.ViewModel.drawAFlag(infoObject.currentHole);
   mvc.ViewModel.zeeLoc(infoObject.currentHole);
 },

 /**
 * catch zoom_changed events
 */
 registerView: function() {
   map.addListener('zoom_changed', function(e) {
     mvc.controller.zoomChanged();
   });
 },

 /** catch clicks on a player
 */
 playerRegister: function(marker, infoObject) {
   marker.addListener('click', function(evt) {
     mvc.controller.playerClick(evt, infoObject);
   });

 },

 /**
 * catch clicks on a flag
 */
 registerFlag: function(flag, infoObject) {
   flag.addListener('click', function(evt) {
     mvc.controller.flagClick(evt, infoObject);
   });
 }
}
