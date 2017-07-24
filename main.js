(() => {
  'use strict';

  const Model = window.STKR.Model;
  const View = window.STKR.View;
  const state = Model.state;
  const uiState = {};


  /* Controller */
  function onButtonClick(args) {
    const actions = {
      'stock-change-btn': function () {
        toggleStockMode();
      },
      'arrow-up-btn': function () {
        swapStocks(args['dataId'], -1);
      },
      'arrow-down-btn': function () {
        swapStocks(args['dataId'], 1);
      }

    };

    if(actions[args['dataType']]){
      actions[args['dataType']]();
    }

    buildDataToUI();
    View.renderRoot(uiState);
  }

  function toggleStockMode() {
    state.ui.stockMode = (state.ui.stockMode + 1) % state.data.stockModes.length;
  }

  function swapStocks(symbol, direction) {
    const stockIndex = state.data.stocks.findIndex((stock) => stock.Symbol === symbol);

    const stockToMove = state.data.stocks[stockIndex];
    state.data.stocks[stockIndex] = state.data.stocks[stockIndex + direction];
    state.data.stocks[stockIndex + direction] = stockToMove;

  }

  function buildStocksByMode(stocks, stocksModes, modeIdx) {
    const stockMode = stocksModes[modeIdx];
    return stocks.reduce((minimalStocksData, stock) => {
      let newStock = {change: stock[stockMode]};
      Object.keys(stock).forEach((key) => {
        if(!stocksModes.includes(key)){
          newStock[key] = stock[key];
        }
      })
      minimalStocksData.push(newStock);

      return minimalStocksData;
    }, []);
  }

  function buildDataToUI() {
    uiState.isFilterOn = state.ui.isFilterOn;
    uiState.data = {};
    uiState.data.stocks = buildStocksByMode(state.data.stocks, state.data.stockModes, state.ui.stockMode);;
  }

  buildDataToUI();
  View.subscribe('click',onButtonClick);
  View.renderRoot(uiState);
})();


