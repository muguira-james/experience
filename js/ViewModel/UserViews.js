
// zooming
//  zooming to < 16 == course View
//  zooming to 17 == default View
//  zomming to > 17 == detail View
//
// player changed - external force changes a players state
//
// clicks on icons


mvc.ViewModel.drawAllPlayers = function() {

  var teeOffset = 90;
  var fairwayOffset = 90;
  var greenOffset = 90;
  var startPoint ;
  //var zoomLevel = mymap.getZoom();

  playerdb.Features.forEach(function(player) {
    if ((player.properties.currentHole <1) || (player.properties.currentHole > 18)) {
      console.log("ERROR: drawAllPlayers: player is off the course??", player.properties.name, player.properties.currentHole);
      return;
    }
    feature2DrawAround = holeLatLong.Features[(player.properties.currentHole - 1)];
    console.log("hole2draw = ", player.properties.currentHole);

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

    var id = {
      "photo": player.properties.photo,
      "name": player.properties.name,
      "location": startPoint,
      "currentHole": player.properties.currentHole,
      "bearing": bearing,
      "holeType2Draw": CurrentViewId.DETAIL_VIEW
    };
    mvc.ViewModel.drawAPlayer(id);

  })

};

mvc.ViewModel.drawAPlayer = function(id) {

    var teeOffset = 90;
    var fairwayOffset = 90;
    var greenOffset = 90;
    var startPoint ;

    //console.log(id);
    playerLocation = destinationPoint(id.location, id.bearing, mvc.ViewModel.getPlayerIconRadius());

    //console.log("draw a player: ",playerLocation, id, id.bearing);
    mvc.ViewModel.addMarker(playerLocation, id);

};


mvc.ViewModel.drawAllPlayersAtAHole = function(drawThisHole) {

  var teeOffset = 90;
  var fairwayOffset = 90;
  var greenOffset = 90;
  var startPoint ;

  var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
  //console.log("all_hole", drawThisHole);
  playerdb.Features.forEach(function(player) {
    if (player.properties.currentHole == holeFeature.properties.number) {

      //console.log("asked to draw player number", player.properties.number);
      console.log(player.properties.name);
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

      mvc.ViewModel.drawAPlayer(id);
    }

  })
}
mvc.ViewModel.zoomToHole = function(drawThisHole) {
  var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
  map.setZoom(16);
  map.panTo(JSON.parse(holeFeature.properties.FlagLocation));
}

mvc.ViewModel.drawCourse = function() {

    //console.log("in drawCourse");

    mvc.ViewModel.deleteOverlays();

    var ho = 0;
    holeLatLong.Features.forEach(function(element) {

      var bearing = 0;
      var id = {
        "photo": element.properties.Flagphoto,
        "name": element.properties.number,
        "location": JSON.parse(element.properties.FlagLocation),
        "currentHole": element.properties.number,
        "bearing": bearing,
        "holeType2Draw": CurrentViewId.DETAIL_VIEW
      }
      console.log( id);
      mvc.ViewModel.addMarker(id.location, id);
      ho = ho + 1;

    //
    // icoName = './images/' + element.properties.image;
    // //console.log(icoName);
    // var HoleIcon = L.icon ({
    //     iconUrl: icoName,
    //     iconAnchor: [8,35],
    //     iconSize: [100, 100]
    //   });
    //
    // marker = L.marker(element.geometry.coordinates, { icon: HoleIcon}).addTo(myCourseView);
    // marker.tPhoto = element.properties.Tphoto;
    // marker.flyTo = element.properties.labelLocation;
    // marker.flagPhoto = element.properties.Flagphoto;
    // marker.tLocation = element.properties.TeeLocation;
    // //console.log(element.properties);
    // marker.geo = element.properties.layoutCoordinates.geometry;
    // marker.holeNumber = element.properties.number;
  });


}
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
mvc.ViewModel.DrawDefaultView = function() {
  mvc.ViewModel.deleteOverlays(); 
  mvc.ViewModel.drawAllPlayers();
}

mvc.ViewModel.DrawCourseView = function() {

  mvc.ViewModel.drawCourse();
};

mvc.ViewModel.DrawDetailView = function() {

  mvc.ViewModel.deleteOverlays();
  mvc.ViewModel.zoomToHole(preferences.currentHole2Draw);
  //console.log("pref hole 2 draw", preferences.currentHole2Draw)
  mvc.ViewModel.drawAllPlayersAtAHole(preferences.currentHole2Draw);

};
mvc.ViewModel.DrawJustMapView = function() {


};
