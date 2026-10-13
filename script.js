const parkingLots = [
  {id:1,name:"Greenway Parking Hub",area:"Porur",address:"Mount Poonamallee Road, Porur",price:30,spaces:18,vehicles:["Car","Bike"],rating:"4.8",type:"Covered",tone:"",featured:true},
  {id:2,name:"Anna Nagar Central Park",area:"Anna Nagar",address:"2nd Avenue, Anna Nagar",price:40,spaces:7,vehicles:["Car"],rating:"4.7",type:"Covered",tone:"tone-2",featured:true},
  {id:3,name:"Mugappair Easy Park",area:"Mugappair",address:"Mogappair East Main Road",price:25,spaces:12,vehicles:["Car","Bike"],rating:"4.5",type:"Open air",tone:"tone-3",featured:false},
  {id:4,name:"Vadapalani Metro Parking",area:"Vadapalani",address:"Near Vadapalani Metro Station",price:20,spaces:24,vehicles:["Bike"],rating:"4.6",type:"Open air",tone:"tone-4",featured:true},
  {id:5,name:"T. Nagar City Parking",area:"T. Nagar",address:"Pondy Bazaar area, T. Nagar",price:50,spaces:4,vehicles:["Car","Bike"],rating:"4.4",type:"Covered",tone:"tone-5",featured:false},
  {id:6,name:"Guindy Transit Park",area:"Guindy",address:"Near Guindy Railway Station",price:35,spaces:9,vehicles:["Car","Bike"],rating:"4.6",type:"Covered",tone:"tone-6",featured:false}
];

const grid = document.getElementById("parkingGrid");
const searchInput = document.getElementById("searchInput");
const availabilityFilter = document.getElementById("availabilityFilter");
const vehicleFilter = document.getElementById("vehicleFilter");
const sortSelect = document.getElementById("sortSelect");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");
let reservedIds = new Set();
let toastTimer;

function getFilteredLots() {
  const query = searchInput.value.trim().toLowerCase();
  const availability = availabilityFilter.value;
  const vehicle = vehicleFilter.value;
  let results = parkingLots.filter(lot => {
    const searchable = [lot.name, lot.area, lot.address, lot.type].join(" ").toLowerCase();
    const matchesSearch = searchable.includes(query);
    const matchesAvailability = availability === "all" ||
      (availability === "available" && lot.spaces >= 8) ||
      (availability === "limited" && lot.spaces < 8);
    const matchesVehicle = vehicle === "all" || lot.vehicles.includes(vehicle);
    return matchesSearch && matchesAvailability && matchesVehicle;
  });
  if (sortSelect.value === "price") results.sort((a,b) => a.price - b.price);
  if (sortSelect.value === "spaces") results.sort((a,b) => b.spaces - a.spaces);
  if (sortSelect.value === "recommended") results.sort((a,b) => Number(b.featured) - Number(a.featured));
  return results;
}

function cardMarkup(lot) {
  const limited = lot.spaces < 8;
  const reserved = reservedIds.has(lot.id);
  const vehicleText = lot.vehicles.join(" · ");
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(lot.name + ", " + lot.address + ", Chennai");
  return `<article class="parking-card">
    <div class="lot-art ${lot.tone}">
      <span class="status-pill ${limited ? "limited" : ""}">${limited ? "Limited spaces" : "Available in demo"}</span>
      <div class="lot-symbol" aria-hidden="true">P</div>
    </div>
    <div class="card-content">
      <div class="card-meta"><span>${lot.area} · ${lot.type}</span><span class="rating">★ ${lot.rating}</span></div>
      <h3>${lot.name}</h3>
      <p class="address">${lot.address}</p>
      <div class="card-details">
        <div><span class="detail-label">SAMPLE SPACES</span><span class="detail-value">${lot.spaces} spots</span></div>
        <div><span class="detail-label">VEHICLES</span><span class="detail-value">${vehicleText}</span></div>
        <div><span class="detail-label">EST. PRICE</span><span class="price">₹${lot.price}<small>/hr</small></span></div>
      </div>
      <div class="card-actions">
        <button class="button button-dark reserve-button" data-id="${lot.id}" type="button">${reserved ? "✓ Demo reserved" : "Try demo reserve"}</button>
        <a class="button button-light" href="${mapsUrl}" target="_blank" rel="noreferrer" aria-label="Search ${lot.name} in Google Maps">Map ↗</a>
      </div>
    </div>
  </article>`;
}

function render() {
  const results = getFilteredLots();
  resultCount.textContent = `Showing ${results.length} of ${parkingLots.length} sample locations`;
  grid.innerHTML = results.map(cardMarkup).join("");
  emptyState.hidden = results.length !== 0;
  grid.hidden = results.length === 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function resetFilters() {
  searchInput.value = "";
  availabilityFilter.value = "all";
  vehicleFilter.value = "all";
  sortSelect.value = "recommended";
  render();
}

[searchInput, availabilityFilter, vehicleFilter, sortSelect].forEach(control => {
  control.addEventListener(control === searchInput ? "input" : "change", render);
});
document.getElementById("clearButton").addEventListener("click", resetFilters);
document.getElementById("emptyReset").addEventListener("click", resetFilters);

grid.addEventListener("click", event => {
  const button = event.target.closest(".reserve-button");
  if (!button) return;
  const id = Number(button.dataset.id);
  const lot = parkingLots.find(item => item.id === id);
  if (reservedIds.has(id)) {
    reservedIds.delete(id);
    showToast(`Demo reservation for ${lot.name} was cancelled.`);
  } else {
    reservedIds.add(id);
    showToast(`Demo reservation confirmed for ${lot.name}. This is not a real booking.`);
  }
  render();
});

render();
