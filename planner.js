const TOKEN = "542b02395f0abc7311ccfcc7f1121c95bc5ea3f2";

async function updatePlanner() {

const cityInput = document.getElementById('cityInput').value.trim();

const city = cityInput
? cityInput.toLowerCase().replace(/\s+/g,'-')
: "greater-noida";

try {

const res = await fetch(`https://api.waqi.info/feed/${city}/?token=${TOKEN}`);

const json = await res.json();

if(json.status === "ok" && json.data){

renderUI(json.data);

}else{

showError("City not found. Check spelling!");

}

}catch(e){

console.error(e);

showError("Unable to fetch data. Try again later.");

}

}



function showError(message){

document.getElementById('cityName').innerText = "Error";
document.getElementById('aqiValue').innerText = "--";
document.getElementById('aqiLabel').innerText = "N/A";
document.getElementById('summaryAdvice').innerText = message;
document.getElementById('updateTime').innerText = "--";
document.getElementById('bestTime').innerText = "Best Time: --";

document.getElementById('aqiCircle').style.borderColor = "#6c757d";
document.getElementById('aqiValue').style.color = "#6c757d";
document.getElementById('aqiLabel').style.color = "#6c757d";

document.getElementById('activityList').innerHTML = "";

}



function renderUI(data){

const aqi = data.aqi ?? 0;

const cityName = data.city.name ?? "Unknown";

document.getElementById('cityName').innerText = cityName;
document.getElementById('aqiValue').innerText = aqi;
document.getElementById('updateTime').innerText =
`Last updated: ${data.time?.s ?? '--'}`;

const circle = document.getElementById('aqiCircle');
const label = document.getElementById('aqiLabel');
const advice = document.getElementById('summaryAdvice');
const bestTime = document.getElementById('bestTime');

let color="#6c757d";
let status="Unknown";
let bestTimeText="--";

if(aqi <= 150){

color="#198754";
status="Excellent";
bestTimeText="Anytime Today";

}

else if(aqi <= 200){

color="#ffc107";
status="Moderate";
bestTimeText="12PM - 4PM";

}

else if(aqi <= 250){

color="#fd7e14";
status="Unhealthy";
bestTimeText="1PM - 3PM";

}

else{

color="#dc3545";
status="Hazardous";
bestTimeText="Avoid Outdoor";

}

circle.style.borderColor = color;
document.getElementById('aqiValue').style.color = color;

label.innerText = status;
label.style.color = color;

advice.innerText = getAdvice(aqi);

bestTime.innerText = `Best Time: ${bestTimeText}`;

renderActivities(aqi);

}



function getAdvice(aqi){

if(aqi <= 50)
return "Air is perfect. Maximize your outdoor goals!";

if(aqi <= 200)
return "Sensitive individuals should limit heavy exertion.";

return "Air quality is poor. Limit outdoor activity strictly.";

}



function renderActivities(aqi){

const list = document.getElementById('activityList');

const activities = [

{ name: "Running", intensity: "High", threshold: 100 },
{ name: "Morning Walk", intensity: "Medium", threshold: 150 },
{ name: "Cycling", intensity: "High", threshold: 100 },
{ name: "Shopping", intensity: "Low", threshold: 200 },
{ name: "Evening Walk", intensity: "Medium", threshold: 120 },
{ name: "Car Washing", intensity: "Low", threshold: 200 }

];

list.innerHTML = activities.map(act => {

let statusClass="safe";
let statusText="SAFE";

if(aqi > act.threshold){

statusClass="danger";
statusText="RISKY";

}
else if(aqi > act.threshold - 30){

statusClass="caution";
statusText="CAUTION";

}

return `

<div class="col-md-6">
<div class="activity-item p-4 m-2 shadow-sm ${statusClass}">

<div class="d-flex justify-content-between align-items-start">

<h6 class="fw-bold mb-1">${act.name}</h6>

<span class="badge ${
statusClass==='safe'
?'bg-success'
:statusClass==='caution'
?'bg-warning text-dark'
:'bg-danger'}">

${statusText}

</span>

</div>

<div class="mt-2">

<span class="small text-muted">
Intensity: ${act.intensity}
</span>

</div>

</div>
</div>

`;

}).join('');

}



window.onload = updatePlanner;