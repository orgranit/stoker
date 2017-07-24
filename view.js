(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  /* View */
  const eventHandlers = {};
  const subscribe = function (eventId, func) {
    if (!eventHandlers[eventId]) {
      eventHandlers[eventId] = [];
    }

    eventHandlers[eventId].push({func: func});
  }

  const publish = function (event) {
    const eventId = event.type;
    const closestAncestor = event.target.closest('li') || event.target;
    const args = { dataId: closestAncestor.getAttribute('data-id'),
                   dataType: event.target.getAttribute('data-type')}

    if (!eventHandlers[eventId]) {
      return false;
    }

    let subscribers = eventHandlers[eventId],
      len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(args);
    }
  };

  function renderRoot(uiState) {
    const rootElm = document.querySelector('#root');

    rootElm.innerHTML = `<div class="content-container">
        <div class="header flex-sb-center"></div>
        <div class="main"></div>
      </div>`;

    renderHeader();
    renderStocks(uiState.data.stocks);
    renderFilterPanel(uiState.isFilterOn)

    Object.keys(eventHandlers).forEach((eventId) => {
      rootElm.addEventListener(eventId, publish);
    })
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

  function renderFilterPanel(isFilterOn) {
    console.log(isFilterOn);
  }

  function renderStocks(stocks) {
    const stocksElm = document.querySelector('.main');
    stocksElm.innerHTML = `<ul class="stock-list">
            ${ stocks.map(buildStockItem).join('') }
          </ul>`;
  }

  function buildStockItem(stock, index, stocks) {
    const stockChange = Number(Number(stock.change).toFixed(2)) || stock.change;
    const disabledUp = index === 0 ? 'disabled' : '';
    const disabledDown = index === stocks.length - 1 ? 'disabled' : '';

    return `<li data-id="${ stock.Symbol }" class="stock-item flex-sb-center">
            <span>${ stock.Symbol } (${ stock.Name })</span>
            <div class="stock-right  flex-sb-center">
              <span>${ Number(stock.LastTradePriceOnly).toFixed(2) }</span>
              <button class='btn-stock  ${getButtonColor(stock)}' data-type="stock-change-btn">
${ stockChange }</button>
              <div class="up-down-arrows">
                <button data-type="arrow-up-btn" class="icon-arrow arrow-up" 
${disabledUp}></button>
                <button data-type="arrow-down-btn" class="icon-arrow arrow-down"
${disabledDown}></button>
              </div>
            </div>
          </li>`;
  }

  function getButtonColor(stock) {
    return stock.change.startsWith('-') ? 'btn-red' : 'btn-green';
  }

  window.STKR.View = {
    subscribe,
    renderRoot,
  };

})();
