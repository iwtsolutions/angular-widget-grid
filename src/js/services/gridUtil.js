(function () {
  angular.module('widgetGrid').service('gridUtil', function () {
    var nextId = 1;
    
    return {
      getUID: function () {
        return (nextId++).toString();
      },
      
      sortWidgets: function (widgets) {
        var sorted = [];
        
        if (!widgets.length || widgets.length < 2) {
          return widgets;
        }
        
        var curr, comp, found;
        for (var i = 0; i < widgets.length; i++) {
          curr = widgets[i];
          
          found = false;
          for (var j = 0; j < sorted.length; j++) {
            comp = sorted[j];
            if (curr.top < comp.top || (curr.top === comp.top && curr.left < comp.left)) {
              sorted.splice(j, 0, curr);
              found = true;
              break;
            }
          }
          if (!found) {
            sorted.push(curr);
          }
        }
        
        return sorted;
      },
      
      computeCellSize: function (rowCount, columnCount) {
        return {
          height: rowCount >= 1 ? (Math.round((100 / rowCount) * 10) / 10) : 0,
          width: columnCount >= 1 ? (Math.round((100 / columnCount) * 10) / 10) : 0
        };
      },
      
      initStateGrid: function (m, n) {
        var stateGrid = [];
        for (var i = 0; i < m; i++) {
          var row = [];
          for (var j = 0; j < n; j++) {
            row.push({
              available: true,
              occupant: null
            });
          }
          stateGrid.push(row);
        }
        return stateGrid;
      }
    };
  });
})();