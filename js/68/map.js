



// map.js (ES module)
const [{ Map, InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
  google.maps.importLibrary('maps'),
  google.maps.importLibrary('marker'),
]);

// Replace with your GeoNames username
const GEONAMES_USER = 'zeligadler';

const searchInput = document.querySelector('#search');
const form = document.querySelector('#form');
const placesList = document.querySelector('#places');

const bmgLoc = { lat: 40.09543950426593, lng: -74.2221793333354 };
const pcsLoc = { lat: 40.108884911823516, lng: -74.21764740599487 };

const map = new Map(document.getElementById('map'), {
  center: bmgLoc,
  zoom: 16,
  renderingType: 'VECTOR',
  mapTypeId: 'satellite'
});

const infoWindow = new InfoWindow();

// Create BMG marker (text-only)
const bmgMarker = new AdvancedMarkerElement({
  map,
  position: bmgLoc,
  title: 'bmg'
});
bmgMarker.addListener('click', () => {
  infoWindow.setContent(`Beth Medrash Govoha ... <br><a href="https://en.wikipedia.org/wiki/Beth_Medrash_Govoha" target="_blank">more</a>`);
  infoWindow.open({ anchor: bmgMarker });
});

// PCS marker with custom image using `content`
const pcsImg = document.createElement('img');
pcsImg.className = 'map-icon';
pcsImg.src = new URL('./images/chulent.jpg', import.meta.url).href;
pcsImg.alt = 'chulent';

const pcsMarker = new AdvancedMarkerElement({
  map,
  position: pcsLoc,
  title: 'pcs',
  content: pcsImg
});
pcsMarker.addListener('click', () => {
  infoWindow.setContent('Yay!!! PCS');
  infoWindow.open({ anchor: pcsMarker });
});

// Fit map to markers
const bounds = new google.maps.LatLngBounds();
bounds.extend(bmgLoc);
bounds.extend(pcsLoc);
map.fitBounds(bounds);

// Search handler (async)
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;

  // Clear old results
  placesList.innerHTML = '';

  // GeoNames wikipediaSearch: prefer HTTPS endpoint (wikipediaSearchJSON)
const url = `https://secure.geonames.org/wikipediaSearchJSON?q=${encodeURIComponent(q)}&maxRows=10&username=${encodeURIComponent(GEONAMES_USER)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    const results = data.geonames || [];

    if (results.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No results found';
      placesList.appendChild(li);
      return;
    }

    // For each result: append list item and optionally create marker
    results.forEach((place) => {
      const li = document.createElement('li');

      const imgSrc = place.thumbnailImg ? place.thumbnailImg : new URL('./images/chulent.jpg', import.meta.url).href;
      li.innerHTML = `
        <div>
          <div class="info">
            <strong>${place.title || ''}</strong>
            <br/>
            <img src="${imgSrc}" alt="${place.title || 'place'}" style="width:64px;height:auto;margin-top:6px;" />
          </div>
          <div class="summary">${place.summary || ''}</div>
        </div>
      `;
      placesList.appendChild(li);

      // If coordinates exist, add a map marker for this place
      if (place.lat && place.lng) {
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: parseFloat(place.lat), lng: parseFloat(place.lng) },
          title: place.title || ''
        });
        marker.addListener('click', () => {
          infoWindow.setContent(`${place.title || ''}<br><a href="https://${place.wikipediaUrl || ''}" target="_blank">Wikipedia</a>`);
          infoWindow.open({ anchor: marker });
        });
      }
    });

  } catch (err) {
    console.error('Search error:', err);
    const li = document.createElement('li');
    li.textContent = `Error: ${err.message}`;
    placesList.appendChild(li);
  }
});