const stocks = [
  {
    "Symbol": "WIX",
    "Name": "Wix.com Ltd.",
    "Change": "0.750000",
    "PercentChange": "+1.51%",
    "LastTradePriceOnly": "76.099998"
  },
  {
    "Symbol": "MSFT",
    "Name": "Microsoft Corporation",
    "PercentChange": "-2.09%",
    "Change": "-0.850006",
    "LastTradePriceOnly": "69.620003"
  },
  {
    "Symbol": "YHOO",
    "Name": "Yahoo! Inc.",
    "Change": "0.279999",
    "PercentChange": "+1.11%",
    "LastTradePriceOnly": "50.599998"
  }
];

function buildHeader() {
  return `<span>stoker</span>
          <ul class="header-buttons">
            <li><button class="icon-search"></button></li>
            <li><button class="icon-refresh"></button></li>
            <li><button class="icon-filter"></button></li>
            <li><button class="icon-settings"></button></li>
          </ul>`
}

function buildStocksList(stocks){
  return `<ul class="stock-list">
            ${ stocks.map(buildStockItem).join('') }
          </ul>`;
}

function buildStockItem(stock, index, stocks) {
  const stockChange = isPercent ? stock.PercentChange : stock.Change;
  const disabledUp = index === 0 ? 'disabled' : '';
  const disabledDown = index === stocks.length - 1 ? 'disabled' : '';

  return `<li class="stock-item flex-sb-center">
            <span>${ stock.Symbol }(${ stock.Name })</span>
            <div class="flex-sb-center">
              <span>${ stock.LastTradePriceOnly }</span>
              <button data-type="stock-change-btn">${ stockChange }</button>
              <div class="up-down-arrows">
                <button data-id="${ stock.Symbol }" data-type="arrow-up-btn" class="icon-arrow arrow-up" 
${disabledUp}></button>
                <button data-id="${ stock.Symbol }" data-type="arrow-down-btn" class="icon-arrow arrow-down" ${disabledDown}></button>
              </div>
            </div>
          </li>`;
}

function moveStocksElement(symbol, direction) {
  const stockIndex = stocks.findIndex((stock) => stock.Symbol === symbol);

  const stockToMove = stocks[stockIndex];
  stocks[stockIndex] = stocks[stockIndex + direction];
  stocks[stockIndex + direction] = stockToMove;

}

function onChangeButtonClick(event) {
  switch (event.target.getAttribute('data-type')) {
    case 'stock-change-btn':
      isPercent = !isPercent;
      mainElm.innerHTML = buildStocksList(stocks);
      break;
    case 'arrow-up-btn':
      moveStocksElement(event.target.getAttribute('data-id'), -1);
      mainElm.innerHTML = buildStocksList(stocks);
      break;
    case 'arrow-down-btn':
      moveStocksElement(event.target.getAttribute('data-id'), 1);
      mainElm.innerHTML = buildStocksList(stocks);
      break;
    default:
      // do nothing
  }
}

const rootElm = document.querySelector('#root');
const headerElm = rootElm.querySelector('.header');
const mainElm = rootElm.querySelector('.main');
let isPercent = true;

headerElm.innerHTML = buildHeader();
mainElm.innerHTML = buildStocksList(stocks);
mainElm.addEventListener("click", onChangeButtonClick);

