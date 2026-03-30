const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const dataDirectory = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, "data");
const waitlistPath = path.join(dataDirectory, "waitlist.json");

app.use(express.json());
app.use(express.static(__dirname));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/waitlist", (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const message = String(req.body?.message || "").trim();

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const existingEntries = readWaitlistEntries();
  const alreadyJoined = existingEntries.some((entry) => entry.email === email);

  if (alreadyJoined) {
    return res.status(409).json({ error: "That email is already on the waitlist." });
  }

  const entry = {
    id: cryptoRandomId(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  existingEntries.push(entry);
  writeWaitlistEntries(existingEntries);

  return res.status(201).json({ ok: true });
});

app.listen(port, () => {
  console.log(`Change Cabana server running on port ${port}`);
});

function readWaitlistEntries() {
  try {
    const content = fs.readFileSync(waitlistPath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeWaitlistEntries(entries) {
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.writeFileSync(waitlistPath, JSON.stringify(entries, null, 2));
}

function cryptoRandomId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
