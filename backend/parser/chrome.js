const puppeteer = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const randomUseragent = require("random-useragent");

// Temporary fix for stealth plugin >= 2.40
// on puppeteer >= 3
// https://github.com/berstend/puppeteer-extra/issues/211
const pluginStealthInstance = pluginStealth();
pluginStealthInstance.onBrowser = () => {};

puppeteer.use(pluginStealthInstance);
puppeteer.use(AdblockerPlugin());
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36";

// Default values
const defaultValues = {
  timeout: 60000,
  navTimeout: 2 * 60 * 1000,
  delay: 100,
  wait: 1000,
};

class Chrome {
  constructor() {
    this.browser = null;
    this.page = null;
    this.navOptions = {
      waitUntil: "networkidle2",
      timeout: defaultValues.navTimeout,
    };
  }

  /**
   * Initiate and launch chrome browser
   */
  async launch() {
    console.log("launching");
    const launchOptions = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-gpu",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-features=site-per-process",
        "--disable-infobars",
        "--disable-extension",
      ],
      ignoreDefaultArgs: ["--enable-automation"],
    };

    /**
     * @type import('puppeteer').Browser
     */
    this.browser = await puppeteer.launch(launchOptions);
    await this.createPage();
  }

  /**
   * Create new page
   */
  async createPage() {
    console.log("creating page");
    /**
     * @type import('puppeteer').Page
     */
    this.page = await this.browser.newPage();
    const userAgent = randomUseragent.getRandom();
    const UA = userAgent || USER_AGENT;

    //Randomize viewport size
    await this.page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });
    await this.page.setUserAgent(UA);
    await this.page.setJavaScriptEnabled(true);
    await this.page.setDefaultTimeout(defaultValues.navTimeout);
  }

  /**
   * Method to complete kill any Puppeteer process still active.
   * Freeing up memory.
   */
  async close() {
    console.log("closing page...");
    await this.page.close();
    await this.browser.close();
    this.page = null;
    this.browser = null;
  }

  /**
   *
   * Wait until the page loads
   */
  async waitForDomComplete() {
    console.log(`waiting to finish loading`);
    // make sure the page is loaded before trying to click
    await this.page.waitForFunction(
      () => window.performance.timing.domComplete,
      { timeout: defaultValues.timeout }
    );
  }

  /**
   *
   * Navigate to URL
   */
  async navigate(url) {
    console.log("navigating");
    // Navigate to actual url
    await this.page.goto(url, this.navOptions);
    await this.waitForDomComplete();
  }

  /**
   * Click on selector
   */
  async click(sel) {
    console.log(`clicking`);
    await this.page.waitForSelector(sel, { visible: true });
    await this.page.click(sel);
  }

  /**
   * Type
   */
  async type(selector, value) {
    console.log(`typing ${value}`);
    await this.page.waitForSelector(selector, { visible: true });
    await this.page.type(selector, value);
  }
}

module.exports = Chrome;
