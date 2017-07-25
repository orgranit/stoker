(() => {
  'use strict';
  const Model = window.STKR.Model;
  const View = window.STKR.View;
  let state = Model.getState();
  const uiState = {};


  /* Controller */
  function onClickHandler(args) {
    const actions = {
      'stock-change-btn': function () {
        toggleStockMode();
      },
      'arrow-up-btn': function () {
        swapStocks(args['dataId'], -1);
      },
      'arrow-down-btn': function () {
        swapStocks(args['dataId'], 1);
      },
      'filter-toggle-btn': function () {
        state.ui.isFilterOn = !state.ui.isFilterOn;
      }

    };

    if(actions[args['dataType']]){

      actions[args['dataType']]();
      buildDataToUI();
      View.renderRoot(uiState);
    }


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

  function fetchStocks() {
    fetch('mocks/stocks.js')
      .then((res) => res.json())
      .then((res) => {
        state.data.stocks = res;
        renderView();
      });

  }

  function renderView() {
    buildDataToUI();
    View.renderRoot(uiState);
    View.unsubscribeAll();
    View.subscribe('click', onClickHandler, false);
    View.subscribe('hashchange',fetchStocks, true);
  }

  fetchStocks();

})();


