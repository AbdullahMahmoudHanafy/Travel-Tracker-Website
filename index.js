import express from "express";
import bodyParser from "body-parser";
import pool from "./database.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

pool.connect();

async function checkVisisted() {
  const result = await pool.query("SELECT country_code FROM visited_countries");

  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {

  const countries = await checkVisisted();

  res.render("index.ejs", {countries: countries, total: countries.length})
});

app.post("/add", async (req, res) => {
  let country = req.body["country"];

  try {
    const result = await pool.query("select country_code from countries where lower(country_name) like '%' || $1 || '%'", [country.toLowerCase()])

    const countryCode = result.rows[0].country_code;
    try{
      await pool.query("insert into visited_countries (country_code) VALUES ($1)", [countryCode]);
      
      res.redirect("/");
    }
    catch (err){
      const countries = await checkVisisted();
  
      res.render("index.ejs", {countries: countries, total: countries.length, error: "This country already exists in the visited countries."})
    }
  }
  catch(err) {
    const countries = await checkVisisted();

    res.render("index.ejs", {countries: countries, total: countries.length, error: "There is no country with that name, please try again."})
  }

})

app.listen(port, () => {
  console.log(`Server running on Port number: ${port}`);
});
