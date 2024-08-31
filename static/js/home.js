function initMap() {
  console.log(navigator.geolocation)
  const location = { lat: -34.397, lng: 150.644 };

  const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: location,
  });
  // The marker, positioned at the location
  const marker = new google.maps.Marker({
      position: location,
      map: map,
  });
}