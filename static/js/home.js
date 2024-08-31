function initMap() {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const map = new google.maps.Map(document.getElementById("map"), {
          zoom: 8,
          center: pos,
        });
        // The marker, positioned at the location
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
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
  }
}
function handleLocationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation
    ? "Error: The Geolocation service failed."
    : "Error: Your browser doesn't support geolocation.");
}