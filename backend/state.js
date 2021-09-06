// Basic implementation of state
// initial state
const state = {
  IS_SCRAPER_RUNNING: false,
};

// reducer
const setScraperState = (value) => {
  state.IS_SCRAPER_RUNNING = value;
};

module.exports = { state, setScraperState };
