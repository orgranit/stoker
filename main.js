(() => {
  'use strict';

  const Model = window.STKR.Model;
  const View = window.STKR.View;

  /* Controller */
  function onButtonClick(event) {
    const actions = {
      'stock-change-btn': function () {
        Model.toggleStockMode();
      },
      'arrow-up-btn': function () {
        Model.swapStocks(event.target.getAttribute('data-id'), -1);
      },
      'arrow-down-btn': function () {
        Model.swapStocks(event.target.getAttribute('data-id'), 1);
      }
    };

    actions[event.target.getAttribute('data-type')]();
    View.renderStocks(buildMinimalStocksData(Model.state.data.stocks, Model.state.data.stockModes, Model.state.ui.stockMode));
  }

  function buildMinimalStocksData(stocks, stocksModes, modeIdx) {
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

  View.setOnButtonClickDelegate(onButtonClick);
  View.renderRoot(buildMinimalStocksData(Model.state.data.stocks, Model.state.data.stockModes, Model.state.ui.stockMode));
})();


