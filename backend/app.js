const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { results } = require("./results");
const { connectionURL } = require("./config");
const parser = require("./parser/scraper");
const { state } = require("./state");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

mongoose.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Successfully Connected to Mongo Database!");
  }
);

const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

app.get("/search", async (req, res) => {
  if (req.query.search) {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = page * limit - limit;
    const regex = new RegExp(escapeRegex(req.query.search.toString()), "gi");
    const data = await results
      .aggregate([
        [
          { $match: { Name: regex } },
          {
            $addFields: {
              sortField: {
                $switch: {
                  branches: [
                    {
                      // case: { $eq: ["$Category", "Non-fiction / Sci-tech"] },
                      case: { $eq: ["$Category", "Scientific articles"] },
                      then: 0,
                    },
                  ],
                  default: 1,
                },
              },
            },
          },
          { $sort: { sortField: 1 } },
          {
            $group: {
              _id: null,
              docs: { $push: "$$ROOT" },
            },
          },
          {
            $unwind: {
              path: "$docs",
              includeArrayIndex: "position",
            },
          },
        ],
      ])
      .skip(skip)
      .limit(limit);

    // run the scraper when there is no data related to the search
    if (data.length === 0) {
      if (state.IS_SCRAPER_RUNNING) {
        return res.send({
          message: "The server is busy, please try again after a few moments",
          success: false,
        });
      }
      parser(req.query.search);
    }
    return res.json({ success: true, data });
  }
});

app.post("/scraper", async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).send({ error: "Please provide query string" });
  }
  if (state.IS_SCRAPER_RUNNING) {
    return res.send({
      message: "The server is busy, please try again after a few moments",
      success: false,
    });
  }
  parser(query);
  return res.send({ message: "Seeding database", success: true });
});

app.get("/", (req, res) => {
  res.send("Service is Working!");
});

app.listen(port, () => console.log(`Listening on port ${port}`));
