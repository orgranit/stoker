(() => {
  'use strict';
  const stocks = getStocks();
  const stockMode = ['PercentChange', 'Change'];
  const state = {
    ui: {
      dailyChange: stockMode[0]
    }
  };

  function getStockChange(stock) {
    return stock[state.ui.dailyChange];
  }

  function getButtonColor(stock) {
    return stock.Change < 0 ? 'btn-red' : 'btn-green';
  }


  function moveStocksElement(symbol, direction) {
    const stockIndex = stocks.findIndex((stock) => stock.Symbol === symbol);

    const stockToMove = stocks[stockIndex];
    stocks[stockIndex] = stocks[stockIndex + direction];
    stocks[stockIndex + direction] = stockToMove;

  }

  function renderHeader() {
    const headerElm = document.querySelector('.header');
    headerElm.innerHTML = `<span>stokr</span>
          <ul class="header-buttons">
            <li><button class="icon-search header-icon"></button></li>
            <li><button class="icon-refresh header-icon"></button></li>
            <li><button class="icon-filter header-icon"></button></li>
            <li><button class="icon-settings header-icon"></button></li>
          </ul>`
  }

  function renderStocks(stocks) {
    const stocksElm = document.querySelector('.main');
    stocksElm.innerHTML = `<ul class="stock-list">
            ${ stocks.map(buildStockItem).join('') }
          </ul>`;
  }

  function buildStockItem(stock, index, stocks) {
    const stockChange = Number(Number(getStockChange(stock)).toFixed(2)) || getStockChange(stock);
    const disabledUp = index === 0 ? 'disabled' : '';
    const disabledDown = index === stocks.length - 1 ? 'disabled' : '';

    return `<li class="stock-item flex-sb-center">
            <span>${ stock.Symbol } (${ stock.Name })</span>
            <div class="stock-right  flex-sb-center">
              <span>${ Number(stock.LastTradePriceOnly).toFixed(2) }</span>
              <button class='btn-stock  ${getButtonColor(stock)}' data-type="stock-change-btn">
${ stockChange }</button>
              <div class="up-down-arrows">
                <button data-id="${ stock.Symbol }" data-type="arrow-up-btn" class="icon-arrow arrow-up" 
${disabledUp}></button>
                <button data-id="${ stock.Symbol }" data-type="arrow-down-btn" class="icon-arrow arrow-down"
${disabledDown}></button>
              </div>
            </div>
          </li>`;
  }

  function onButtonClick(event) {
    const actions = {
      'stock-change-btn': function () {
        state.ui.dailyChange = stockMode[(stockMode.indexOf(state.ui.dailyChange) + 1) % stockMode.length];
        renderStocks(stocks);
      },
      'arrow-up-btn': function () {
        moveStocksElement(event.target.getAttribute('data-id'), -1);
        renderStocks(stocks);
      },
      'arrow-down-btn': function () {
        moveStocksElement(event.target.getAttribute('data-id'), 1);
        renderStocks(stocks);
      }
    };

    return actions[event.target.getAttribute('data-type')]();
  }

  function renderRoot() {
    const rootElm = document.querySelector('#root');

    rootElm.innerHTML = `<div class="content-container">
        <div class="header flex-sb-center"></div>
        <div class="main"></div>
      </div>`;

    renderHeader();
    renderStocks(stocks);

    rootElm.addEventListener("click", onButtonClick);
  }

  renderRoot();
})();


