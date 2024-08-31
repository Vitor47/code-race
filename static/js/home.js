let map

function initMap() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map = new google.maps.Map(document.getElementById("map"), {
          zoom: 8,
          center: pos,
        });

        const marker = new google.maps.Marker({
          position: pos,
          map: map,
        });
      },
      () => {
        handleLocationError(true, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, map.getCenter());
  }
}

function geocodeCity() {
  const city = document.getElementById("city_input").value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ 'address': city }, function (results, status) {
    if (status === 'OK') {
      map.setCenter(results[0].geometry.location);
      map.setZoom(12);

      new google.maps.Marker({
        position: results[0].geometry.location,
        map: map,
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function handleLocationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.");
}