(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  /**
   * Private
   */

  const state = {
    ui: {
      stockMode: 0,
      isFilterOn: false,
      filters: {
        name: '',
        trend: 'All',
        range: ['NaN', 'NaN']
      },
      userStocks: ["WIX","MTCH","GOOG","AAPL","YHOO"]
    },
    data: {
      stocks: [],
      stockModes: ['realtime_change', 'realtime_chg_percent', 'MarketCapitalization'],
      stockChangeSuffix: ['', '%', 'B'],
    }
  };

  /**
   * Public
   */

  function getState() {
    return state;
  }



  window.STKR.Model = {
    getState
  };

})();
