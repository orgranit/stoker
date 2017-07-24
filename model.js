(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  const stocks = getStocks();

  const state = {
    ui: {
      stockMode: 0,
      isFilterOn: false
    },
    data: {
      stocks: stocks,
      stockModes: ['PercentChange', 'Change']
    }
  };



  window.STKR.Model = {
    state
  };

})();
