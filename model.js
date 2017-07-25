(() => {
  'use strict';
  /* Model */
  window.STKR = window.STKR || {};

  const state = {
    ui: {
      stockMode: 0,
      isFilterOn: false
    },
    data: {
      stocks: [],
      stockModes: ['PercentChange', 'Change']
    }
  };

  function getState() {
    return state;
  }



  window.STKR.Model = {
    getState
  };

})();
