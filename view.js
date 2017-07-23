(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  /* View */

  let onButtonClickDelegate;

  function setOnButtonClickDelegate(func) {
    onButtonClickDelegate = func;
  }

  function renderRoot(stocks) {
    const rootElm = document.querySelector('#root');

    rootElm.innerHTML = `<div class="content-container">
        <div class="header flex-sb-center"></div>
        <div class="main"></div>
      </div>`;

    renderHeader();
    renderStocks(stocks);

    if(onButtonClickDelegate){
      rootElm.addEventListener("click", onButtonClickDelegate);
    }
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
    console.log(stocks);
    const stocksElm = document.querySelector('.main');
    stocksElm.innerHTML = `<ul class="stock-list">
            ${ stocks.map(buildStockItem).join('') }
          </ul>`;
  }

  function buildStockItem(stock, index, stocks) {
    const stockChange = Number(Number(stock.change).toFixed(2)) || stock.change;
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

  function getButtonColor(stock) {
    return stock.change.startsWith('-') ? 'btn-red' : 'btn-green';
  }

  window.STKR.View = {
    setOnButtonClickDelegate,
    renderRoot,
    renderHeader,
    renderStocks,
  };

})();
