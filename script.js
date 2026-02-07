let BW = {
  projects: 0,
  plans: 0,
  costs: 0,
  materials: 0,
  history: []
};

function showPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function updateDashboard() {
  pCount.innerText = BW.projects;
  planCount.innerText = BW.plans;
  costCount.innerText = BW.costs;
  matCount.innerText = BW.materials;
  saveData();
}

function saveData() {
  localStorage.setItem("buildwise", JSON.stringify(BW));
}

function loadData() {
  let d = localStorage.getItem("buildwise");
  if (d) BW = JSON.parse(d);
  updateDashboard();
}

loadData();

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePlan() {
  let area = Number(document.getElementById("area").value);
  let floors = Number(document.getElementById("floors").value);
  let quality = document.getElementById("quality").value;

  if (!area || !floors) {
    alert("Enter valid details");
    return;
  }

  let rate = quality === "standard" ? 1800 : quality === "premium" ? 2500 : 3500;
  let cost = area * floors * rate;

  let cement = area * floors * 0.45;
  let steel = area * floors * 3.2;
  let sand = area * floors * 1.8;

  BW.projects++;
  BW.plans++;
  BW.costs++;
  BW.materials++;

  BW.history.push({ area, floors, quality, cost, cement, steel, sand });

  planOutput.innerHTML = `
  <h3>AI Generated Plan</h3>
  Area: ${area} sq.ft <br>
  Floors: ${floors} <br>
  Quality: ${quality} <br>
  Estimated Cost: ₹${cost.toLocaleString()} <br><br>
  Cement: ${cement.toFixed(2)} Tons <br>
  Steel: ${steel.toFixed(2)} Kg <br>
  Sand: ${sand.toFixed(2)} Tons
  `;

  updateDashboard();
}

function calculateMaterial() {
  let area = Number(m_area.value);
  let floors = Number(m_floors.value);

  if (!area || !floors) {
    alert("Enter details");
    return;
  }

  let cement = area * floors * 0.45;
  let steel = area * floors * 3.2;
  let sand = area * floors * 1.8;
  let bricks = area * floors * 55;

  BW.materials++;

  materialOutput.innerHTML = `
  <h3>Material Estimation</h3>
  Cement: ${cement.toFixed(2)} Tons <br>
  Steel: ${steel.toFixed(2)} Kg <br>
  Sand: ${sand.toFixed(2)} Tons <br>
  Bricks: ${bricks.toFixed(0)} Nos
  `;

  updateDashboard();
}

function calculateCost() {
  let area = Number(c_area.value);
  let rate = Number(c_quality.value);

  if (!area) {
    alert("Enter area");
    return;
  }

  let total = area * rate;
  BW.costs++;

  costOutput.innerHTML = `
  <h3>Cost Estimation</h3>
  Total Construction Cost: ₹${total.toLocaleString()}
  `;

  updateDashboard();
}

function generateInsight() {
  let ideas = [
    "Prefab slabs reduce time by 22%",
    "Solar roofs save 35% energy",
    "Optimized columns save 18% material",
    "Rainwater harvesting saves 50k liters yearly",
    "Smart ventilation cuts cooling cost by 25%"
  ];

  aiOutput.innerHTML = "💡 " + ideas[rand(0, ideas.length - 1)];
}

function voiceAI() {
  let msg = new SpeechSynthesisUtterance("Hello, I am BuildWise AI assistant.");
  speechSynthesis.speak(msg);
}

function generatePDF() {
  let text = `
BUILDWISE PRO AI REPORT

Projects: ${BW.projects}
Plans: ${BW.plans}
Cost Reports: ${BW.costs}
Material Reports: ${BW.materials}

Generated: ${new Date().toLocaleString()}
`;

  let blob = new Blob([text], { type: "application/pdf" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "BuildWise_Report.pdf";
  a.click();

  reportStatus.innerHTML = "✅ Report Generated Successfully";
}

/* Charts */

let mainChart = document.getElementById("mainChart");
let mctx = mainChart.getContext("2d");

function drawMainChart() {
  mctx.clearRect(0, 0, mainChart.width, mainChart.height);

  let vals = [
    BW.projects * 10,
    BW.plans * 10,
    BW.costs * 10,
    BW.materials * 10
  ];

  vals.forEach((v, i) => {
    mctx.fillStyle = "cyan";
    mctx.fillRect(100 + i * 180, 320 - v, 70, v);
  });
}

setInterval(drawMainChart, 1500);

let liveChart = document.getElementById("liveChart");
let lctx = liveChart.getContext("2d");

setInterval(() => {
  lctx.clearRect(0, 0, liveChart.width, liveChart.height);

  for (let i = 0; i < 10; i++) {
    let h = rand(40, 300);
    lctx.fillStyle = "cyan";
    lctx.fillRect(40 + i * 80, 330 - h, 40, h);
  }
}, 1200);

updateDashboard();



function init3DHouse() {

  const container = document.getElementById("threeContainer");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(75, container.clientWidth/400, 0.1, 1000);
  camera.position.set(4,4,6);

  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(container.clientWidth,400);
  container.appendChild(renderer.domElement);

  // Light
  const light = new THREE.PointLight(0xffffff,1);
  light.position.set(5,5,5);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x404040);
  scene.add(ambient);

  // House base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(3,2,3),
    new THREE.MeshStandardMaterial({color:0x00ffff})
  );
  base.position.y = 1;
  scene.add(base);

  // Roof
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(2.5,1.5,4),
    new THREE.MeshStandardMaterial({color:0xff4444})
  );
  roof.position.y = 2.5;
  roof.rotation.y = Math.PI/4;
  scene.add(roof);

  function animate(){
    requestAnimationFrame(animate);
    scene.rotation.y += 0.005;
    renderer.render(scene,camera);
  }

  animate();
}

window.addEventListener("load", init3DHouse);


