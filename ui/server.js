import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.static("./ui/public"));

app.get("/api/exports", (req, res) => {
    const exportDir = path.join(process.cwd(), "exports");
    const files = fs.readdirSync(exportDir).filter(f => f.endsWith(".json"));
    res.json(files);
});

app.get("/api/exports/:file", (req, res) => {
    const filePath = path.join(process.cwd(), "exports", req.params.file);
    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        res.json(data);
    } else {
        res.status(404).json({ error: "File not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
