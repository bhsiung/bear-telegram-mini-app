const express = require("express");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/foo", (req, res) => {
  res.setHeader("content-type", "application/json");
  res.json({ foo: 123, now: new Date().getTime() });
});

const filePath = "counter.json";

// Initialize the counter file if it doesn't exist
if (!fs.existsSync(filePath)) {
  const initialData = {
    count: 0,
    update: Date.now(),
  };
  fs.writeFileSync(filePath, JSON.stringify(initialData));
}

// Route handler for /counter
app.get("/counter", (req, res) => {
  // Read the current data from the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return res.status(500).send("Server Error");
    }

    let counterData = JSON.parse(data);

    // Update the count and timestamp
    counterData.count += 1;
    counterData.update = Date.now();

    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(counterData), (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return res.status(500).send("Server Error");
      }

      // Send the updated data as the response
      res.json(counterData);
    });
  });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
