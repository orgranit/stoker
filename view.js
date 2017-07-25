(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  /* View */
  let eventHandlers = {};
  const rootElm = document.querySelector('#root');

  function unsubscribeAll() {
    eventHandlers = {};
  }

  function subscribe(eventId, func, isWindow) {
    if (!eventHandlers[eventId]) {
      eventHandlers[eventId] = [];
    }

    eventHandlers[eventId].push({func: func});

    if(isWindow){
      window.addEventListener(eventId, func);
    } else {
      rootElm.addEventListener(eventId, publish);
    }
  }

  function publish(event) {
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
    rootElm.innerHTML = `
      <div class="content-container">
        <div class="header flex-sb-center"></div>
        <div class="main"></div>
      </div>`;

    if(window.location.hash.slice(1) === 'search'){
        renderSearchHeader();
        renderSearchBody();
    } else {
      renderStocksHeader(uiState.isFilterOn);
      renderFilterPanel(uiState.isFilterOn);
      renderStocks(uiState.data.stocks, uiState.isFilterOn);
    }
  }

  function renderSearchHeader() {
    const headerElm = document.querySelector('.header');
    headerElm.innerHTML += `
                      <input type="text" class="search-input">
                      <button class="btn-search-cancel"><a href="#">Cancel</a></button>`
  }

  function renderSearchBody() {

  }

  function renderStocksHeader(isFilterOn) {
    const headerElm = document.querySelector('.header');
    headerElm.innerHTML += `<span>stokr</span>
          <ul class="header-buttons">
            <li>
              <a href="#search"> 
                <button class="icon-search header-icon"></button>
              </a>
            </li>
            <li>
              <button class="icon-refresh header-icon"></button>
            </li>
            <li>
              <button data-type="filter-toggle-btn" class="icon-filter header-icon ${isFilterOn ? 'green' : ''}"></button>
             </li>
            <li>
              <button class="icon-settings header-icon"></button>
            </li>
          </ul>`
  }

  function renderFilterPanel(isFilterOn) {
    const mainElm = document.querySelector('.main');
    mainElm.innerHTML += `
        <div class="filter-panel flex-sb-center ${isFilterOn? 'visible' : 'hidden'}">
          <ul class="filter-list">
            <li class="filter-item">
              <label for="name">By Name</label> 
              <input type="text" id="name" class="filter-input">
            </li>
            <li class="filter-item">
              <label for="range-from">By Range: From</label>
              <input type="text" id="range-from" class="filter-input">
            </li>
            <li class="filter-item">
              <label for="gane">By Gain</label>
              <select id="gane" class="filter-input"> 
                <option value="all" selected>All</option> 
                <option value="losing">Losing</option>
                <option value="gaining">Gaining</option>
              </select>
            </li>
            <li class="filter-item">
              <label for="range-to">By Range: To</label> 
              <input type="text" id="range-to" class="filter-input">
            </li>
          </ul>
          <button class="btn-filter-apply">Apply</button>
        </div>`
  }

  function renderStocks(stocks, isFilterOn) {
    const mainElm = document.querySelector('.main');
    mainElm.innerHTML += `<ul class="stock-list">
            ${ stocks.map(buildStockItem.bind(null, isFilterOn)).join('') }
          </ul>`;
  }

  function buildStockItem(isFilterOn, stock, index, stocks) {
    const stockChange = Number(Number(stock.change).toFixed(2)) || stock.change;
    const disabledUp = index === 0 ? 'disabled' : '';
    const disabledDown = index === stocks.length - 1 ? 'disabled' : '';

    return `<li data-id="${ stock.Symbol }" class="stock-item flex-sb-center">
            <span>${ stock.Symbol } (${ stock.Name })</span>
            <div class="stock-right  flex-sb-center">
              <span>${ Number(stock.LastTradePriceOnly).toFixed(2) }</span>
              <button class='btn-stock  ${getButtonColor(stock)}' data-type="stock-change-btn">
${ stockChange }</button>
              <div class="up-down-arrows ${isFilterOn ? 'hidden' : ''}">
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
    unsubscribeAll,
    renderRoot
  };

})();
