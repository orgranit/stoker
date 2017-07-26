(() => {
  /* View */

  'use strict';
  window.STKR = window.STKR || {};
  let eventHandlers = {};
  const rootElm = document.querySelector('#root');

  /**
   * Private
   */

  function publish(event) {
    const eventId = event.type;
    let args = {};
    if(event.type === 'submit'){
      args = filtersSubmitHandler(event);
    } else {
      const closestAncestor = event.target.closest('li') || event.target;
      args = { dataId: closestAncestor.getAttribute('data-id'),
        dataType: event.target.getAttribute('data-type')}
    }

    if (!eventHandlers[eventId]) {
      return false;
    }

    let subscribers = eventHandlers[eventId],
      len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(args);
    }
  };

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
      <form>
        <div class="filter-panel flex-sb-center ${isFilterOn? 'visible' : 'hidden'}">
            <div class="filter-list">
              <div class="filter-item">
                <label for="name">By Name</label> 
                <input type="text" name="name" id="name" class="filter-input">
              </div>
              <div class="filter-item">
                <label for="range-from">By Range: From</label>
                <input type="text" name="range-from" id="range-from" class="filter-input">
              </div>
              <div class="filter-item">
                <label for="trend">By Gain</label>
                <select name="trend" id="trend" class="filter-input"> 
                  <option value="all" selected>All</option> 
                  <option value="losing">Losing</option>
                  <option value="gaining">Gaining</option>
                </select>
              </div>
              <div class="filter-item">
                <label for="range-to">By Range: To</label> 
                <input type="text" name="range-to" id="range-to" class="filter-input">
              </div>
            </div>
            <input type="submit" class="btn-filter-apply">
        </div>
      </form>`
  }

  function renderStocks(stocks, isFilterOn) {
    const mainElm = document.querySelector('.main');
    mainElm.innerHTML += `<ul class="stock-list">
            ${ stocks.map(buildStockItem.bind(null, isFilterOn)).join('') }
          </ul>`;
  }

  function buildStockItem(isFilterOn, stock, index, stocks) {
    const disabledUp = index === 0 ? 'disabled' : '';
    const disabledDown = index === stocks.length - 1 ? 'disabled' : '';

    return `<li data-id="${ stock.Symbol }" class="stock-item flex-sb-center">
            <span>${ stock.Symbol } (${ stock.Name })</span>
            <div class="stock-right  flex-sb-center">
              <span>${ stock.LastTradePriceOnly }</span>
              <button class='btn-stock  ${getButtonColor(stock)}' data-type="stock-change-btn">
${ stock.Change }</button>
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
    return stock.isGaining ? 'btn-red' : 'btn-green';
  }

  function filtersSubmitHandler(e) {
    e.preventDefault();
    const formInputs = e.target.elements;
    const name = formInputs.name.value;
    const trend = formInputs.trend.value;
    const rangeFrom = formInputs['range-from'].value;
    const rangeTo = formInputs['range-to'].value;

    return { name, trend, range: [rangeFrom, rangeTo] };
  }

  /**
   * Public
   */

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

  function unsubscribeAll() {
    eventHandlers = {};
  }

  function subscribe(eventId, func, isWindow) {
    if (!eventHandlers[eventId]) {
      eventHandlers[eventId] = [];
    }

    if(isWindow){
      window.addEventListener(eventId, func);
    } else {
      rootElm.addEventListener(eventId, publish);
      eventHandlers[eventId].push({func: func});
    }
  }

  window.STKR.View = {
    renderRoot,
    subscribe,
    unsubscribeAll
  };

})();
