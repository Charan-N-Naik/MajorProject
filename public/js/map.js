
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 10, // starting zoom
});
// create a marker at a coordinate

// console.log(coordinates)
// const marker = new mapboxgl.Marker({color:"red"})
//   .setLngLat(listing.geometry.coordinates)
//   .addTo(map);


// const popup = new mapboxgl.Popup({ closeOnClick: false })
//     .setHTML(`<h3>${listing.location}<h3>`)
//     .addTo(map);
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)   // Listing.geometry.coordinates
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.location}</h4><p>Exact Location provided after booking</p>`
        )
    )
    .addTo(map);
