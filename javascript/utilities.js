

function drawHoleLayout(geometry, layer) {

  var holeStyle = { "color": "#ffff00", "weight": 2, "opacity": 0.65 };
  L.geoJSON(geometry, {style: holeStyle}).addTo(layer);

}

var toRad = function(n) {
   var z = n* Math.PI / 180;
   //console.log(n,z);
   return z
}

var toDeg = function(n) {
   return n * 180 / Math.PI;
}

var destinationPoint = function(latlng, brng, dist) {
   dist = dist / 6371;
   brng = toRad(brng);

   var lat1 = toRad(latlng[0]), lon1 = toRad(latlng[1]);

   //console.log(brng,latlng[0], latlng[1], lat1,lon1);
   var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
                        Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

   var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
                                Math.cos(lat1),
                                Math.cos(dist) - Math.sin(lat1) *
                                Math.sin(lat2));

   if (isNaN(lat2) || isNaN(lon2)) return null;
   //console.log(lat2,lon2);
   return new L.LatLng(toDeg(lat2), toDeg(lon2));
}

function drawAllPlayers() {

  var teeOffset = 90;
  var fairwayOffset = 90;
  var greenOffset = 90;
  var startPoint ;
  var zoomLevel = mymap.getZoom();

  playerdb.Features.forEach(function(player) {
    if ((player.properties.currentHole <1) || (player.properties.currentHole > 18)) {
      console.log("drawAllPlayers: player is off the course??", player.properties.name, player.properties.currentHole);
      return;
    }
    feature2DrawAround = holeLatLong.Features[(player.properties.currentHole - 1)];
    //console.log("asked to draw player number", player.properties.number);
    console.log(player.properties.name);
    if (player.properties.locationOnHole == 'tee') {
      startPoint = feature2DrawAround.properties.TeeLocation;
      bearing = teeOffset;
      teeOffset = teeOffset + 180;
    }

    if (player.properties.locationOnHole == 'fairway') {
      startPoint = feature2DrawAround.properties.labelLocation;
      bearing = fairwayOffset;
      fairwayOffset = fairwayOffset + 180;
    }

    if (player.properties.locationOnHole == 'green') {
      startPoint = feature2DrawAround.properties.FlagLocation;
      bearing = greenOffset;
      greenOffset = greenOffset + 180;
    }

    drawAPlayer(startPoint, mvc.currentView,
      player.properties.photo,
      player.properties.name, bearing, player.properties.currentHole, 120);

  })

}

function drawAPlayer(location, layer, photo, name, bearing, currentHole, iconSize) {

    var teeOffset = 90;
    var fairwayOffset = 90;
    var greenOffset = 90;
    var startPoint ;
    var zoomLevel = mymap.getZoom();

    //console.log("zoom level = ", zoomLevel);
    //player = playerdb.Features[playerIndex];

    console.log("drawAPlayer", iconSize);
    playerLocation = destinationPoint(location, bearing, mvc.playerIconRadius);
    var PlayerIcon = L.icon({
          iconUrl: photo,
          iconSize:     [iconSize, iconSize],
          iconAnchor:   [40, 42]
      });
    //console.log(PlayerIcon, bearing);
    detailplayer = L.marker(playerLocation, {icon: PlayerIcon}).addTo(layer);
    detailplayer.info = { "photo": photo, "name": name, "location": location, "currentHole": currentHole };

}


function drawAllPlayersAtAHole(holeFeature, layer, playerdb, iconSize) {

  var teeOffset = 90;
  var fairwayOffset = 90;
  var greenOffset = 90;
  var startPoint ;
  var zoomLevel = mymap.getZoom();

  console.log("drawAllPlayersAtAHole", iconSize);

  playerdb.Features.forEach(function(player) {
    if (player.properties.currentHole == holeFeature.properties.number) {

      //console.log("asked to draw player number", player.properties.number);
      console.log(player.properties.name);
      if (player.properties.locationOnHole == 'tee') {
        startPoint = holeFeature.properties.TeeLocation;
        bearing = teeOffset;
        teeOffset = teeOffset + 180;
      }

      if (player.properties.locationOnHole == 'fairway') {
        startPoint = holeFeature.properties.labelLocation;
        bearing = fairwayOffset;
        fairwayOffset = fairwayOffset + 180;
      }

      if (player.properties.locationOnHole == 'green') {
        startPoint = holeFeature.properties.FlagLocation;
        bearing = greenOffset;
        greenOffset = greenOffset + 180;
      }

      drawAPlayer(startPoint, layer,
        player.properties.photo,
        player.properties.name, bearing, player.properties.currentHole, iconSize);
    }

  })
}
var MVC = {

  playerIconRadius: 0.04,
  currentView: "course"
}

var drawCourse = function() {

    myCourseView.clearLayers();
    holeLatLong.Features.forEach(function(element) {

    icoName = './images/' + element.properties.image;
    //console.log(icoName);
    var HoleIcon = L.icon ({
        iconUrl: icoName,
        iconAnchor: [8,35],
        iconSize: [100, 100]
      });

    marker = L.marker(element.geometry.coordinates, { icon: HoleIcon}).addTo(myCourseView);
    marker.tPhoto = element.properties.Tphoto;
    marker.flyTo = element.properties.labelLocation;
    marker.flagPhoto = element.properties.Flagphoto;
    marker.tLocation = element.properties.TeeLocation;
    //console.log(element.properties);
    marker.geo = element.properties.layoutCoordinates.geometry;
    marker.holeNumber = element.properties.number;
  });


}
