import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");

// connect to static files such as CSS under "public".
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  // Read data from JSON file
  const dataPath = path.join(__dirname, "data", "blogs.json");
  let items = [];

  try {
    const data = await readFile(dataPath, "utf8");
    const jsonData = JSON.parse(data);

    items = jsonData;
    console.log(items);
  } catch (err) {
    console.error("Error reading or parsing JSON file:", err);
  }

  res.render("index.ejs", { blogs: items });
});

app.post("/submit", async (req, res) => {
  let inputNickname = req.body.Nickname;
  let inputTitle = req.body.Title;
  let inputBody = req.body.body;

  //write data from the form to json file.
  const formData = req.body;
  const currentDate = new Date();
  formData.date = currentDate.toLocaleDateString();
  formData.time = currentDate.toLocaleTimeString();

  try {
    const dataPath = path.join(__dirname, "data", "blogs.json");
    const data = await readFile(dataPath, "utf8");

    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }

    jsonData.push(formData);

    await writeFile(dataPath, JSON.stringify(jsonData, null, 2));

    //res.send('Data successfully saved!');

    res.render("index.ejs", {
      nicknameToSite: `${inputNickname}`,
      titleToSite: `${inputTitle}`,
      bodyToSite: `${inputBody}`,
      blogs: jsonData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while processing the data.");
  }
});

app.get("/blog_detail/:number", async (req, res) => {
  const number = parseInt(req.params.number);

  // Read data from JSON file
  const dataPath = path.join(__dirname, "data", "blogs.json");
  let items = [];

  try {
    const data = await readFile(dataPath, "utf8");
    const jsonData = JSON.parse(data);

    items = jsonData;
    console.log(items);
  } catch (err) {
    console.error("Error reading or parsing JSON file:", err);
  }

  if(items[number]){
    res.render("blog_detail.ejs", {blog: items[number]})
  }else{
    res.status(404).send("Blog not found")
  };
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
