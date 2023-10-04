const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./database");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/save-message", (req, res) => {
  const { name, email, Message } = req.body;

  const sql = "INSERT INTO message (name, email, Message) VALUES (?, ?, ?)";
  const values = [name, email, Message];

  db.run(sql, values, (err) => {
    if (err) {
      console.error("Error saving message:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      console.log("message saved successfully");
      res.status(200).json({ message: "message submitted successfully!" });
    }
  });
});
app.get("/api/get-projects", (req, res) => {
  // Read the JSON file and send it as a response
  const fs = require("fs");
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).json({ error: "Error reading JSON file" });
    } else {
      const projects = JSON.parse(data);
      res.status(200).json(projects);
    }
  });
});

app.get("/api/get-message", (req, res) => {
  db.all("SELECT * FROM message", (err, rows) => {
    if (err) {
      console.error("Error fetching message data:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      if (rows.length === 0) {
        res.status(404).json({ message: "No message data found" });
      } else {
        let html = "";

        html += '<!DOCTYPE html><html lang="en">';
        html += '<head>';
        html += '<meta charset="UTF-8">';
        html += '<title>message Data</title>';
        html += '<style>';
        html += 'table { border-collapse: collapse; width: 100%; }';
        html += 'th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }';
        html += 'th { background-color: #f2f2f2; }';
        html += '</style>';
        html += '</head>';
        html += '<body>';
        html += '<table>';
        html += '<tr>';
        html += '<th>Name</th>';
        html += '<th>Email</th>';
        html += '<th>Message</th>';
        html += '</tr>';

        rows.forEach((row) => {
          html += '<tr>';
          html += `<td>${row.name}</td>`;
          html += `<td>${row.email}</td>`;
          html += `<td>${row.Message}</td>`; 
          html += '</tr>';
        });

        html += '</table>';
        html += '</body>';
        html += '</html>';

        res.status(200).send(html);
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
