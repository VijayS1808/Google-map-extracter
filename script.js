const API_KEY = "YOUR_API_KEY_HERE";

async function searchPlaces() {
  const query = document.getElementById("query").value;
  const location = document.getElementById("location").value;

  const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`;
  const geoRes = await fetch(geoUrl);
  const geoData = await geoRes.json();

  if (!geoData.results.length) {
    alert("Invalid location");
    return;
  }

  const { lat, lng } = geoData.results[0].geometry.location;

  const searchUrl =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=5000` +
    `&keyword=${encodeURIComponent(query)}` +
    `&key=${API_KEY}`;

  const res = await fetch(searchUrl);
  const data = await res.json();

  document.getElementById("results").innerHTML = "";

  for (const place of data.results) {
    await getPlaceDetails(place.place_id);
  }
}

async function getPlaceDetails(placeId) {
  const detailsUrl =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=name,formatted_address,formatted_phone_number` +
    `&key=${API_KEY}`;

  const res = await fetch(detailsUrl);
  const data = await res.json();

  const p = data.result;
  const row = `
    <tr>
      <td>${p.name || "N/A"}</td>
      <td>${p.formatted_phone_number || "N/A"}</td>
      <td>${p.formatted_address || "N/A"}</td>
    </tr>
  `;

  document.getElementById("results").innerHTML += row;
}
