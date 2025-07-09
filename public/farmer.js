// ==========================
// 🔁 Update Live Time (HH:MM)
// ==========================
function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');
  document.getElementById("current-time").textContent = `${hours}:${mins}`;
}

updateTime(); // Run once on load
setInterval(updateTime, 60000); // Update every minute

// ==========================
// 🌤️ Map icon code to FontAwesome
// ==========================
function getWeatherIcon(iconCode) {
  if (iconCode.startsWith("01")) return "fa-sun";               // Clear
  if (iconCode.startsWith("02")) return "fa-cloud-sun";         // Few clouds
  if (iconCode.startsWith("03")) return "fa-cloud";             // Scattered clouds
  if (iconCode.startsWith("04")) return "fa-cloud-meatball";    // Broken clouds
  if (iconCode.startsWith("09")) return "fa-cloud-showers-heavy"; // Shower rain
  if (iconCode.startsWith("10")) return "fa-cloud-sun-rain";    // Rain
  if (iconCode.startsWith("11")) return "fa-bolt";              // Thunderstorm
  if (iconCode.startsWith("13")) return "fa-snowflake";         // Snow
  if (iconCode.startsWith("50")) return "fa-smog";              // Mist
  return "fa-question";                                         // Unknown
}

// ==========================
// 📍 Get weather using backend
// ==========================
async function fetchWeather(lat, lon) {
  try {
    const res = await fetch(`/weather?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error("Failed to fetch weather data");

    const data = await res.json();
    console.log("✅ Weather data:", data);

    document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById("location-name").textContent = data.name;

    const iconCode = data.weather[0].icon;
    const weatherIcon = document.getElementById("weather-icon");
    weatherIcon.className = "fa-solid weather-icon " + getWeatherIcon(iconCode);
  } catch (error) {
    console.error("❌ Weather error:", error);
    document.getElementById("temperature").textContent = "--°C";
    document.getElementById("location-name").textContent = "Unable to get weather data";
  }
}

// ==========================
// 📡 Get user location and fetch weather
// ==========================
function getUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 User location:", latitude, longitude);
        fetchWeather(latitude, longitude);
      },
      (err) => {
        console.error("❌ Location error:", err);
        document.getElementById("location-name").textContent = "Location access denied";
        document.getElementById("temperature").textContent = "--°C";
      }
    );
  } else {
    document.getElementById("location-name").textContent = "Geolocation not supported";
    document.getElementById("temperature").textContent = "--°C";
  }
}

// ==========================
// 🚀 Init on page load
// ==========================
getUserLocation();

async function loadItems() {
  try {
    const res = await fetch('http://localhost:3000/api/mandi-items');
    if (!res.ok) throw new Error('Failed to fetch items');

    const items = await res.json();
    console.log("📦 Loaded items:", items);

    const row = document.querySelector('.row.justify-content-center');
    row.innerHTML = ''; // Clear existing

    items.forEach(item => {
      const id = item.id || item._id;
      const cardHtml = `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
          <div class="card h-100">

            <!-- Normal View -->
            <div class="card-view" id="card-view-${id}">
              <img src="${item.imageUrl}" class="card-img-top" alt="${item.name}" />
              <div class="card-body text-center">
                <h5 class="card-title">${item.name}</h5>
                <select class="form-select form-select-sm mb-2">
                  <option>1kg</option>
                  <option>500g</option>
                  <option>5kg</option>
                  <option>10kg</option>
                </select>
                <h6>₹${item.price}</h6>
                <button class="btn btn-sm btn-warning mt-2" onclick="showEditForm('${id}')">Edit</button>
                <button class="btn btn-sm btn-danger mt-2" onclick="deleteItem('${id}')">Delete</button>
              </div>
            </div>

            <!-- Edit View -->
            <div class="card-edit" id="card-edit-${id}" style="display:none; padding: 1rem;">
              <input type="text" id="edit-name-${id}" value="${item.name}" class="form-control mb-2" />
              <input type="url" id="edit-imageUrl-${id}" value="${item.imageUrl}" class="form-control mb-2" />
              <input type="text" id="edit-category-${id}" value="${item.category || ''}" class="form-control mb-2" />
              <input type="number" id="edit-price-${id}" value="${item.price}" class="form-control mb-2" />
              <button class="btn btn-sm btn-success me-2" onclick="updateItem('${id}')">Save</button>
              <button class="btn btn-sm btn-secondary" onclick="hideEditForm('${id}')">Cancel</button>
            </div>

          </div>
        </div>
      `;
      row.insertAdjacentHTML('beforeend', cardHtml);
    });

  } catch (err) {
    console.error('Error loading items:', err);
  }
}

function showEditForm(id) {
  document.getElementById(`card-view-${id}`).style.display = 'none';
  document.getElementById(`card-edit-${id}`).style.display = 'block';
}

function hideEditForm(id) {
  document.getElementById(`card-edit-${id}`).style.display = 'none';
  document.getElementById(`card-view-${id}`).style.display = 'block';
}

window.addEventListener('DOMContentLoaded', loadItems);
