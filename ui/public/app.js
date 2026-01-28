const exportSelect = document.getElementById("exportSelect");
const videoList = document.getElementById("videoList");

async function loadExports() {
    const files = await fetch("/api/exports").then(r => r.json());  
    files.forEach(file => {
        const option = document.createElement("option");
        option.value = file;
        option.textContent = file;
        exportSelect.appendChild(option);
    });
    if (files.length > 0) loadExportData(files[0]);
}

exportSelect.addEventListener("change", (e) => {
    loadExportData(e.target.value);
});

async function loadExportData(file) {
    const data = await fetch(`/api/exports/${file}`).then(r => r.json());
    videoList.innerHTML = data.map(v => `
        <div class="video-item">
            <strong>${v.author?.nickname || "Unknown"}</strong>
            <span>${new Date(v.createTime * 1000).toLocaleString()}</span>
            <p>${v.desc || ""}</p>
        </div>
    `).join("");
}

loadExports();
