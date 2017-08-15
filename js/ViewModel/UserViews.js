
// zooming
//  zooming to < 16 == course View
//  zooming to 17 == default View
//  zomming to > 17 == detail View
//
// player changed - external force changes a players state
//
// clicks on icons

/**
* add the ViewModel to the mvc
*/
mvc.ViewModel.drawAllPlayers = function() {

 var teeOffset = 90;
 var fairwayOffset = 90;
 var greenOffset = 90;
 var startPoint ;

 // loop over the playerdb adn draw all the players
 //
 // this assumes the player have had their "hole" and "hole location (i.e. tee, fairway or green)" set"
 playerdb.Features.forEach(function(player) {
   if ((player.properties.currentHole <1) || (player.properties.currentHole > 18)) {
     console.log("ERROR: drawAllPlayers: player is off the course??", player.properties.name, player.properties.currentHole);
     return;
   }
   feature2DrawAround = holeLatLong.Features[(player.properties.currentHole - 1)];
   //console.log("hole2draw = ", player.properties.currentHole);
   /*
   * startPoint, bearing and teeOffset are used by code in util.js
   */
   switch (player.properties.locationOnHole) {
     case 'tee': {
       startPoint = JSON.parse(feature2DrawAround.properties.TeeLocation);
       bearing = teeOffset;
       teeOffset = teeOffset + 180;
       break;
     }
     case 'fairway': {
       startPoint = JSON.parse(feature2DrawAround.properties.labelLocation);
       bearing = fairwayOffset;
       fairwayOffset = fairwayOffset + 180;
       break;
     }

     case 'green': {
       startPoint = JSON.parse(feature2DrawAround.properties.FlagLocation);
       bearing = greenOffset;
       greenOffset = greenOffset + 180;
       break;
     }

   };
   // make an information object to operate on in the click callback
   var id = {
     "photo": player.properties.photo,
     "name": player.properties.name,
     "location": startPoint,
     "currentHole": player.properties.currentHole,
     "bearing": bearing,
     "holeType2Draw": CurrentViewId.DETAIL_VIEW
   };
   var playerLocation = mvc.ViewModel.drawAPlayer(id);
   //drawAPlayer returns a valid map location, set it into the information object for the click callback
   player.properties.position = playerLocation;
   id.position = playerLocation;
 })

};

/**
* draw a single player based on the information passed in the id object
*
* a refactor note: this currently hides the radius distance a player is
* drawn out from the actual player location
*/
mvc.ViewModel.drawAPlayer = function(id) {

   var playerLocation = destinationPoint(id.location, id.bearing, mvc.ViewModel.getPlayerIconRadius());
   mvc.ViewModel.addPlayer(playerLocation, id);
   return playerLocation;
};


/**
* search the player db and draw only the players at the given hole
*/
mvc.ViewModel.drawAllPlayersAtAHole = function(drawThisHole) {

  var teeOffset = 90;
  var fairwayOffset = 90;
  var greenOffset = 90;
  var startPoint ;

 var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
 console.log();
 playerdb.Features.forEach(function(player) {
   if (player.properties.currentHole == holeFeature.properties.number) {

     //console.log("asked to draw player number", player.properties.number);
     console.log("at_hole", drawThisHole, "name", player.properties.name, "cur hOl", player.properties.currentHole);
     if (player.properties.locationOnHole == 'tee') {
       startPoint = JSON.parse(holeFeature.properties.TeeLocation);
       bearing = teeOffset;
       teeOffset = teeOffset + 180;
     }

     if (player.properties.locationOnHole == 'fairway') {
       startPoint = JSON.parse(holeFeature.properties.labelLocation);
       bearing = fairwayOffset;
       fairwayOffset = fairwayOffset + 180;
     }

     if (player.properties.locationOnHole == 'green') {
       startPoint = JSON.parse(holeFeature.properties.FlagLocation);
       bearing = greenOffset;
       greenOffset = greenOffset + 180;
     }

     var id = {
       "photo": player.properties.photo,
       "name": player.properties.name,
       "location": startPoint,
       "currentHole": player.properties.currentHole,
       "bearing": bearing,
       "holeType2Draw": CurrentViewId.DETAIL_VIEW
     }

     var playerLocation = mvc.ViewModel.drawAPlayer(id);
     player.properties.position = playerLocation;
     id.position = playerLocation;
   }

 })
}

/**
* change the map center, the map zoom
*
* DO NOT change the view here.  Do that in the function that called this
*/
mvc.ViewModel.zoomToHole = function(drawThisHole) {
 var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
 map.setZoom(holeFeature.properties.holeZoomLevel);
 mvc.ViewModel.setZoomLevel(holeFeature.properties.holeZoomLevel);
 map.panTo(JSON.parse(holeFeature.properties.labelLocation));
}

/**
* change the map zoom only
*/
mvc.ViewModel.zoomToPlayer = function(drawThisHole) {
 var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
 map.setZoom(19);
 mvc.ViewModel.setZoomLevel(19);
 //map.panTo(JSON.parse(holeFeature.properties.FlagLocation));
}

/**
* draw all the flags.  Use the info inthe holeconfiguration db (holeLatLong)
*/
mvc.ViewModel.drawFlags = function() {
 var ho = 0;
 holeLatLong.Features.forEach(function(element) {

   var bearing = 0;
   var id = {
     "photo": element.properties.Flagphoto,
     "name": element.properties.number,
     "location": JSON.parse(element.properties.FlagLocation),
     "currentHole": element.properties.number,
     "bearing": bearing,
     "holeZoomLevel": element.properties.holeZoomLevel,
     "holeType2Draw": CurrentViewId.HOLE_VIEW
   }
   //console.log( id);
   mvc.ViewModel.addFlag(id.location, id);
   ho = ho + 1;  // looks like a junk var; should factor this out later
});
},

/**
* this draw a single flag on the map at a lat lng.
*/
mvc.ViewModel.drawAFlag = function(flag2Draw) {
 var ho = 0;
 var holeFeature = holeLatLong.Features[(flag2Draw - 1)];

 var bearing = 0;
 var id = {
   "photo": holeFeature.properties.Flagphoto,
   "name": holeFeature.properties.number,
   "location": JSON.parse(holeFeature.properties.FlagLocation),
   "currentHole": holeFeature.properties.number,
   "bearing": bearing,
   "holeZoomLevel": holeFeature.properties.holeZoomLevel,
   "holeType2Draw": CurrentViewId.HOLE_VIEW
 }
   //console.log( id);
   mvc.ViewModel.addFlag(id.location, id);
},

/**
* draws the course (i.e. all the flags, should draw ammenities when I add them)
*/
mvc.ViewModel.drawCourse = function() {

   mvc.ViewModel.deleteOverlays();
   mvc.ViewModel.deleteLayerOverlays();
   mvc.ViewModel.drawFlags();
}

/**
* poorly named: draw the mask around a holeLatLong
*/
mvc.ViewModel.zeeLoc = function(hole2Draw) {
 h = holeLatLong.Features[(hole2Draw - 1)];

 c = h.properties.InnerMask.coordinates;
 m = computeBounds4Hole(c);
 var g = {geometry: new google.maps.Data.Polygon([m, c]), fillColor: '#000000',
   fillOpacity: 0.35, id: 44};

 layersArray.push(g);
 //console.log(JSON.stringify(m, null, 4), JSON.stringify(c, null, 4));
 map.data.add(g);
 map.data.setStyle({fillOpacity: 0.35, strokeColor: '#000000', strokeOpacity: 0.2})
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// These are high level functions
// ---------------------------------------------------------------------------
mvc.ViewModel.DrawDefaultView = function() {
 mvc.ViewModel.deleteOverlays();
 mvc.ViewModel.drawFlags();
 map.panTo(preferences.TrumpNationLatLng);
 mvc.ViewModel.drawAllPlayers();
 var id = { "photo": "./images/Fan.png" }
 mvc.ViewModel.addFan(preferences.TrumpNationLatLng, id);
}

mvc.ViewModel.DrawCourseView = function() {
 mvc.ViewModel.deleteOverlays();
 mvc.ViewModel.drawCourse();
};

mvc.ViewModel.DrawDetailView = function() {

 mvc.ViewModel.deleteOverlays();
 //mvc.ViewModel.zoomToPlayer(preferences.currentHole2Draw);
 console.log("pref hole 2 draw", preferences.currentHole2Draw)
 mvc.ViewModel.drawAllPlayersAtAHole(preferences.currentHole2Draw);

};
