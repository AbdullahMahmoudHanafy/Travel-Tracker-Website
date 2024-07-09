import express from "express";
import bodyParser from "body-parser";
import pool from "./database.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

pool.connect();;

app.get("/", async (req, res) => {

  pool.query("select country_code from visited_countries", (err, que) => {
    if (!err)
    {
      let countries = []
      que.rows.forEach((country) => {
        countries.push(country.country_code);
      })
      res.render("./index.ejs", {countries: countries, total: que.rowCount})
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
