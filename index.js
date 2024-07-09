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

app.post("/add", async (req, res) => {
  let country = req.body["country"];
  
  const country_code = await pool.query("select country_code from countries where country_name = $1", [country])

  if (country_code.rowCount != 0)
  {
    await pool.query("insert into visited_countries (country_code) VALUES ($1)", [country_code.rows[0].country_code]);
    
    res.redirect("/");
  }

})

app.listen(port, () => {
  console.log(`Server running on Port number: ${port}`);
});
