(() => {
  /* Controller */

  'use strict';
  const Model = window.STKR.Model;
  const View = window.STKR.View;
  const state = Model.getState();
  state.ui = JSON.parse(localStorage.getItem('uiState')) || state.ui;
  let uiState = state.ui;

  function onClickHandler(args) {
    const actions = {
      'stock-change-btn': function () {
        toggleStockMode();
        renderView();
      },
      'arrow-up-btn': function () {
        swapStocksBySymbol(args['dataId'], -1);
        renderView();
      },
      'arrow-down-btn': function () {
        swapStocksBySymbol(args['dataId'], 1);
        renderView();
      },
      'filter-toggle-btn': function () {
        state.ui.isFilterOn = !state.ui.isFilterOn;
        renderView();
      },
      'add-stock-btn': function () {
        state.ui.userStocks.push(args['dataId']);
        fetchStocks();
      }

    };

    if(actions[args['dataType']]){
      actions[args['dataType']]();
    }
  }

  function buildSearchStocks(stocks) {
    return stocks.map((stock) => {
      const searchStock = {};
      searchStock.name = stock.name;
      searchStock.symbol = stock.symbol;
      searchStock.exchDisp = stock.exchDisp;

      return searchStock;
    })
  }

  function onKeyUpHandler(query) {
    state.ui.searchQuery = query;
    fetch(`http://localhost:7000/search?q=${ query }`)
      .then((res) => res.json())
      .then((res) => {
        state.ui.searchStocks = buildSearchStocks(res.ResultSet.Result);
        renderView();
      });
  }

  function toggleStockMode() {
    state.ui.stockMode = (state.ui.stockMode + 1) % state.data.stockModes.length;
  }

  function switchStocks(stockIndex, direction, stocks) {
    const stockToMove = stocks[stockIndex];
    stocks[stockIndex] = stocks[stockIndex + direction];
    stocks[stockIndex + direction] = stockToMove;
  }

  function swapStocksBySymbol(symbol, direction) {
    const stockIndex = state.data.stocks.findIndex((stock) => stock.Symbol === symbol);
    switchStocks(stockIndex, direction, state.data.stocks);
    switchStocks(stockIndex, direction, state.ui.userStocks);
  }

  function prettfyStock(newStock, suffix) {
    let change = Number(newStock.Change) || Number(newStock.Change.slice(0, -1));
    newStock.Change = change.toFixed(2) + suffix;
    newStock.LastTradePriceOnly = Number(newStock.LastTradePriceOnly).toFixed(2);
  }

  function buildMinimalStocks(stocks, props, suffix) {
    return stocks.reduce((minimalStocksData, stock) => {
      let newStock = {};
      Object.keys(props).forEach((key) => {
        newStock[key] = stock[props[key]];
      })

      newStock.isGaining = stock.Change.startsWith('-');
      prettfyStock(newStock, suffix);

      minimalStocksData.push(newStock);
      return minimalStocksData;
    }, []);
  }

  function filterStocks(stocks, filters) {
    return stocks.reduce((filteredStocks, stock) => {
      let toAdd = true;
      const filterName = filters.name.toLowerCase();
      const filterTrend = filters.trend.toLowerCase() === 'all' ? false : filters.trend.toLowerCase();
      const filterRangeFrom = filters.range[0] === '' ? NaN : Number(filters.range[0]);
      const filterRangeTo = filters.range[1] === '' ? NaN : Number(filters.range[1]);

      if(!stock.Symbol.toLowerCase().includes(filterName) || !stock.Name.toLowerCase().includes(filterName)) {
        toAdd = false;
      }

      if(filterTrend) {
        const isGain = !stock.Change.startsWith('-');
        if(isGain && filterTrend !== 'gaining'){
          toAdd = false;
        } else if(!isGain && filterTrend !== 'losing'){
          toAdd = false;
        }
      }

      const stockChangePrecent = Number(stock.realtime_chg_percent);
      if(stockChangePrecent < filterRangeFrom || stockChangePrecent > filterRangeTo) {
        toAdd = false;
      }

      if(toAdd){
        filteredStocks.push(stock);
      }

      return filteredStocks;
    }, []);
  }

  function buildDataToUI() {
    const props = {Symbol :'Symbol',
      Name: 'Name',
      LastTradePriceOnly: 'LastTradePriceOnly',
      Change: state.data.stockModes[state.ui.stockMode]};

    uiState = state.ui;
    uiState.data = {};

    const filteredStocks = state.ui.isFilterOn ? filterStocks(state.data.stocks, state.ui.filters) : state.data.stocks;
    uiState.data.stocks = buildMinimalStocks(filteredStocks, props, state.data.stockChangeSuffix[state.ui.stockMode]);
  }

  function fetchStocks() {
    fetch(`http://localhost:7000/quotes?q=${state.ui.userStocks.join()}`)
      .then((res) => res.json())
      .then((res) => {
        state.data.stocks = res.query.results.quote;
        console.log(res.query.results.quote);
        subscribeEventListeners();
        renderView();
      });

  }

  function setFilters(userFilters) {
    state.ui.filters = userFilters;
    renderView();
  }

  function subscribeEventListeners() {
    View.unsubscribeAll();
    View.subscribe('click', onClickHandler, false);
    View.subscribe('submit', setFilters, false);
    View.subscribe('hashchange',renderView, true);
    View.subscribe('keyup', onKeyUpHandler, false);
  }

  function saveUIState() {
    localStorage.setItem('uiState', JSON.stringify(state.ui));
  }

  function renderView() {
    saveUIState();
    buildDataToUI();
    View.renderRoot(uiState);
  }

  fetchStocks();
})();


