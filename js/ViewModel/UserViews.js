
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
    //console.log("hole2draw = ", player.properties.currentHole);

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
    var playerLocation = mvc.ViewModel.drawAPlayer(id);
    player.properties.position = playerLocation;
    id.position = playerLocation;
    //console.log(player.properties.name, player.properties.position.lat(), player.properties.position.lng());
  })

};

mvc.ViewModel.drawAPlayer = function(id) {

    var playerLocation = destinationPoint(id.location, id.bearing, mvc.ViewModel.getPlayerIconRadius());
    mvc.ViewModel.addPlayer(playerLocation, id);
    return playerLocation;
};


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
mvc.ViewModel.zoomToHole = function(drawThisHole) {
  var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
  map.setZoom(holeFeature.properties.holeZoomLevel);
  mvc.ViewModel.setZoomLevel(holeFeature.properties.holeZoomLevel);
  map.panTo(JSON.parse(holeFeature.properties.labelLocation));
}

mvc.ViewModel.zoomToPlayer = function(drawThisHole) {
  var holeFeature = holeLatLong.Features[(drawThisHole - 1)];
  map.setZoom(19);
  mvc.ViewModel.setZoomLevel(19);
  map.panTo(JSON.parse(holeFeature.properties.FlagLocation));
}

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
    ho = ho + 1;
});
},

mvc.ViewModel.drawCourse = function() {

    //console.log("in drawCourse");

    mvc.ViewModel.deleteOverlays();

    mvc.ViewModel.drawFlags();


}

mvc.ViewModel.zeeLoc = function(hole2Draw) {
  h = holeLatLong.Features[(hole2Draw - 1)];
  //console.log("--->",h.properties)
  //m = h.properties.OuterMask.coordinates;
  c = h.properties.InnerMask.coordinates;
  //
  // var minLat = 1000, maxLat = -1000, minLng = 1000, maxLng = -1000;
  // for (j=0; j<c.length; j++) {
  //   if (c[j].lat < minLat) {
  //     minLat = c[j].lat;
  //   }
  //   if (c[j].lat > maxLat) {
  //     maxLat = c[j].lat;
  //   }
  //   if (c[j].lng < minLng) {
  //     minLng = c[j].lng;
  //   }
  //   if (c[j].lng > maxLng) {
  //     maxLng = c[j].lng;
  //   }
  // }
  // //console.log(minLat.toPrecision(8), maxLat.toPrecision(8), minLng.toPrecision(8), maxLng.toPrecision(8));
  //
  // var mm_lat, mn_lng, mx_lat, mx_lng;
  // mn_lat = minLat - 0.0007;
  // mx_lat = maxLat + 0.0007;
  // mn_lng = minLng - 0.0007;
  // mx_lng = maxLng + 0.0007;
  //
  // var m = [];
  // m.push(new google.maps.LatLng(mn_lat, mn_lng));
  // m.push(new google.maps.LatLng(mn_lat, mx_lng));
  // m.push(new google.maps.LatLng(mx_lat, mx_lng));
  // m.push(new google.maps.LatLng(mx_lat, mn_lng));
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
// ---------------------------------------------------------------------------
mvc.ViewModel.DrawDefaultView = function() {
  mvc.ViewModel.deleteOverlays();
  mvc.ViewModel.drawFlags();
  map.panTo(preferences.TrumpNationLatLng);
  mvc.ViewModel.drawAllPlayers();
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
