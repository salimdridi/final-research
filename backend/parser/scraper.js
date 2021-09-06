const mongoose = require("mongoose");
const waait = require("waait");

const { results } = require("../results");
const { setScraperState } = require("../state");
const Chrome = require("./chrome");

const savetoDB = async (data) => {
  return results.collection.insertMany(data);
};

class LibgenScraper extends Chrome {
  constructor(query) {
    super();
    this.baseURL = "https://libgen.rs";
    this.searchURL = "";
    this.category = "";
    this.searchQuery = query;
    this.maximumPage = 0;
  }
  /**
   * Select category
   * @param {string} category
   */
  async selectCategory(category) {
    console.log("formatting url according to category");
    this.category = category;
    switch (category) {
      case "Scientific articles":
        this.maximumPage = 4;
        this.searchURL = `${this.baseURL}/scimag/?q=${this.searchQuery}`;
        break;
      case "Non-fiction / Sci-tech":
      default:
        this.maximumPage = 25;
        this.searchURL = `${this.baseURL}/search.php?req=${this.searchQuery}&res=${this.maximumPage}`;
        break;
    }
  }
  /**
   * Navigate to search query
   * Example: https://libgen.rs/search.php?req=test&res=25
   * @param {string} searchUrl
   */
  async search(searchUrl) {
    console.log("navigate to search result page");
    await this.navigate(searchUrl);
  }

  /**
   * Extract result page
   */

  async extractNonFictionalData() {
    let data;
    await this.page.waitForSelector("body > table.c > tbody");
    data = await this.page.evaluate((category) => {
      const trs = [...document.querySelectorAll("body > table.c > tbody tr")];
      trs.shift();
      if (trs.length < 1) return null;

      const getText = (elem) => {
        return elem.innerText.trim();
      };
      const getSize = (inp) => {
        if (inp.includes("MB")) {
          return parseInt(inp.trim().replace("MB", "").trim());
        }
        return parseInt(inp.trim().replace("MB", "").trim()) / 1000;
      };
      const result = trs.map((tr) => {
        const tds = [...tr.querySelectorAll("td")];
        const links = tds[2].querySelectorAll("a");
        const size = getText(tds[7]);
        return {
          Link: links.length > 1 ? links[1].href : links[0].href,
          Name: links.length > 1 ? getText(links[1]) : getText(links[0]),
          Author: getText(tds[1]),
          Year: getText(tds[4]),
          Pages: getText(tds[5]),
          Size: size && getSize(size),
          Type: getText(tds[8]),
          Category: category,
        };
      });
      return result;
    }, this.category);
    return data;
  }

  /**
   * Extract result page
   */

  async extractSCArticleData() {
    let data;
    await this.page.waitForSelector(".catalog");
    data = await this.page.evaluate((category) => {
      const trs = [...document.querySelectorAll(".catalog >tbody tr")];
      if (trs.length < 1) return null;

      const getText = (elem) => {
        return elem.innerText.trim();
      };
      const getSize = (inp) => {
        if (inp.includes("MB")) {
          return parseInt(inp.trim().replace("MB", "").trim());
        }
        return parseInt(inp.trim().replace("MB", "").trim()) / 1000;
      };
      const result = trs.map((tr) => {
        const tds = [...tr.querySelectorAll("td")];
        const name = tds[1].querySelectorAll("a");
        const size = getText(tds[3]);
        return {
          Link: name.length && name[0].href,
          Name: name.length && getText(name[0]),
          Author: getText(tds[0]),
          Journal: getText(tds[2]),
          Size: size && getSize(size),
          Category: category,
        };
      });
      return result;
    }, this.category);
    return data;
  }

  /**
   * Extract search result with pagination and save to db
   */
  async collectData() {
    for (let page = 1; page <= this.maximumPage; page++) {
      await waait(1000);
      console.log(`Current Page: ${page}`);
      try {
        let data = null;
        await this.search(`${this.searchURL}&page=${page}`);
        switch (this.category) {
          case "Scientific articles":
            data = await this.extractSCArticleData();
            break;
          case "Non-fiction / Sci-tech":
          default:
            data = await this.extractNonFictionalData();
            break;
        }
        if (data) {
          await savetoDB(data);
        } else {
          page = this.maximumPage;
        }
      } catch (error) {
        console.log(`collectData => `, error);
        page = this.maximumPage;
      }
    }
  }
}

const parser = async (query) => {
  setScraperState(true);
  // const categories = ["Scientific articles"];
  const categories = ["Scientific articles", "Non-fiction / Sci-tech"];
  const scraper = new LibgenScraper(query);
  await scraper.launch();
  for (const category of categories) {
    try {
      console.log(`Selected Category: ${category}`);
      await scraper.selectCategory(category);
      await scraper.collectData();
    } catch (error) {
      console.error(`parser => `, error);
    }
  }
  await scraper.close();
  setScraperState(false);
  return true;
};

module.exports = parser;
