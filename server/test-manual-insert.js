import { initDB } from "./db.js";

const db = initDB();

db.prepare('INSERT INTO portals (x, y, z, from_scene, target_url) VALUES (?, ?, ?, ?, ?)')
  .run(10, 2, 10, 'hub', 'https://marble.worldlabs.ai/world/2393c7b1-0fd9-4733-89ef-004d8591ef7b');

console.log("Inserted test portal into hub.");
db.close();
