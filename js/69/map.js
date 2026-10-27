// --- configuration ---
const GEONAMES_USER = 'zeligadler'; // replace with your GeoNames username
const MAX_RECENTS = 20;

// --- DOM refs ---
const searchInput = document.querySelector('#search');
const form = document.querySelector('#form');
const placesList = document.querySelector('#places');
const clearBtn = document.querySelector('#clear-recent');

// --- persistent recentsearches (store only plain objects) ---
const stored = localStorage.getItem('recentsearches');
const recentsearches = stored ? JSON.parse(stored) : [];

function saveRecents() {
  // keep most recent first
  localStorage.setItem('recentsearches', JSON.stringify(recentsearches.slice(0, MAX_RECENTS)));
}

function renderRecent() {
  placesList.innerHTML = '';
  if (recentsearches.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No recent searches';
    placesList.appendChild(li);
    return;
  }
  for (const p of recentsearches) {
    const li = document.createElement('li');
    const imgSrc = p.thumbnailImg || '';
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(p.title || '')}</strong>
        <div class="summary">${escapeHtml(p.summary || '')}</div>
        ${imgSrc ? `<img src="${imgSrc}" alt="${escapeHtml(p.title||'place')}" style="width:64px;height:auto;margin-top:6px;" />` : ''}
      </div>
    `;
    placesList.appendChild(li);
  }
}

// Simple escaping for inserted strings (we use innerHTML in places)
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(m) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
  });
}

renderRecent();

clearBtn.addEventListener('click', () => {
  recentsearches.length = 0;
  saveRecents();
  renderRecent();
});

// --- load maps libraries once and initialize map ---
const [{ Map, InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
  google.maps.importLibrary('maps'),
  google.maps.importLibrary('marker'),
]);

// initial map center (fallback)
const bmgLoc = { lat: 40.0954395, lng: -74.2221793 };
const map = new Map(document.getElementById('map'), {
  center: bmgLoc,
  zoom: 13,
  mapId: undefined, // set if you use a custom map style
});

const infoWindow = new InfoWindow();

// store created markers so we can manage them
const markers = [];

function clearMarkers() {
  for (const m of markers) m.setMap(null);
  markers.length = 0;
}

// --- search handler ---
form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;

  // clear UI + markers
  placesList.innerHTML = '';
  clearMarkers();

  // GeoNames secure endpoint (wikipediaSearchJSON)
  const url = `https://secure.geonames.org/wikipediaSearchJSON?q=${encodeURIComponent(q)}&maxRows=10&username=${encodeURIComponent(GEONAMES_USER)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const data = await res.json();
    const results = (data && data.geonames) ? data.geonames : [];

    if (results.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No results found';
      placesList.appendChild(li);
      return;
    }

    // extend map bounds to include results
    const bounds = new google.maps.LatLngBounds();

    for (const place of results) {
      // create a plain serializable record for storage
      const item = {
        title: place.title || '',
        summary: place.summary || '',
        thumbnailImg: place.thumbnailImg || '',
        lat: place.lat || null,
        lng: place.lng || null,
        wikipediaUrl: place.wikipediaUrl || ''
      };

      // push to front of recent list (most recent first)
      recentsearches.unshift(item);
      if (recentsearches.length > MAX_RECENTS) recentsearches.pop();
      saveRecents();

      // render list item
      const li = document.createElement('li');
      const imgHtml = item.thumbnailImg ? `<img src="${item.thumbnailImg}" alt="${escapeHtml(item.title)}" style="width:64px;height:auto;margin-top:6px;" />` : '';
      li.innerHTML = `
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <div class="summary">${escapeHtml(item.summary)}</div>
          ${imgHtml}
        </div>
      `;
      placesList.appendChild(li);

      // add marker if coordinate available; create new DOM content per marker
      if (item.lat && item.lng) {
        const pos = { lat: parseFloat(item.lat), lng: parseFloat(item.lng) };
        bounds.extend(pos);

        // create unique DOM content (image) for this marker
        const markerImg = document.createElement('img');
        markerImg.className = 'map-icon';
        markerImg.src = item.thumbnailImg || '';
        markerImg.alt = item.title || 'place';
        markerImg.style.width = '64px';

        const marker = new AdvancedMarkerElement({
          map,
          position: pos,
          title: item.title,
          content: markerImg
        });

        marker.addListener('click', () => {
          const wikiLink = item.wikipediaUrl ? `<a href="https://${item.wikipediaUrl}" target="_blank" rel="noopener">Wikipedia</a>` : '';
          infoWindow.setContent(`${escapeHtml(item.title)}<br/>${wikiLink}`);
          infoWindow.open({ anchor: marker });
        });

        markers.push(marker);
      }
    } // end for

    // fit to bounds if we have any coordinates
    if (!bounds.isEmpty) {
      map.fitBounds(bounds);
    }

  } catch (err) {
    console.error('Search error:', err);
    const li = document.createElement('li');
    li.textContent = `Error: ${err.message}`;
    placesList.appendChild(li);
  } finally {
    renderRecent(); // refresh recent sidebar from saved array
  }
});