(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  const stocks = getStocks();
  const stockModes = ['PercentChange', 'Change'];

  const state = {
    ui: {
      stockMode: 0
    },
    data: {
      stocks: stocks,
      stockModes: ['PercentChange', 'Change']
    }
  };

  function getStockMode(stock) {
    return stock[stockModes[state.ui.stockMode]];
  }

  function toggleStockMode() {
    state.ui.stockMode = (state.ui.stockMode + 1) % stockModes.length;
  }

  function swapStocks(symbol, direction) {
    const stockIndex = stocks.findIndex((stock) => stock.Symbol === symbol);

    const stockToMove = stocks[stockIndex];
    stocks[stockIndex] = stocks[stockIndex + direction];
    stocks[stockIndex + direction] = stockToMove;

  }

  window.STKR.Model = {
    state,
    getStockMode,
    toggleStockMode,
    swapStocks
  };

})();
