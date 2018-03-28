(function () {
  /**
   * @ngdoc service
   * @name widgetGrid.gridRenderer
   *
   * @description
   * Provides methods for rendering grids.
   *
   * @requires widgetGrid.GridArea
   * @requires widgetGrid.GridRendering
   */
  angular.module('widgetGrid').service('gridRenderer', function (GridArea, GridRendering) {
    var service = {
      render: render
    };

    /**
     * @ngdoc method
     * @name render
     * @methodOf widgetGrid.gridRenderer
     *
     * @description
     * Creates a rendering for a given grid, assigning positions to unpositioned widgets,
     * repositioning widgets with non-valid positions, and resolving position clashes.
     *
     * @param {Grid} grid Grid
     * @return {GridRendering} Rendering
     */
    function render(grid, emitWidgetPositionUpdated) {
      var widgets = grid && grid.widgets ? grid.widgets : [];
      var unpositionedWidgets = [];
      var rendering = new GridRendering(grid);

      angular.forEach(widgets, function (widget) {
        var position = widget.getPosition();
        if (position.width * position.height === 0 ||
            rendering.isAreaObstructed(position)) {
          unpositionedWidgets.push(widget);
        } else {
          rendering.setWidgetPosition(widget.id, widget);
        }
      });

      angular.forEach(unpositionedWidgets, function (widget) {
        var message = '';
        
        if (widget.height && widget.height !== 0 &&
            widget.width && widget.width !== 0) {
          var nextPosition = rendering.getNextPositionForSize(widget.height, widget.width);
          
          if (nextPosition !== null) {
            renderWithFixedSize(widget);
          } else {
            renderWithVariableSize(widget);
            message = 'Widget will not fit at default size. Adjusted size to fit available space.';
          }
        } else {
          renderWithVariableSize(widget);
        }
        
        if (emitWidgetPositionUpdated !== undefined) {
          emitWidgetPositionUpdated(widget, message);
        }
      });
      
      function renderWithFixedSize(widget) {
        var nextPosition = rendering.getNextPositionForSize(widget.height, widget.width);

        if (nextPosition !== null) {
          nextPosition.height = widget.height;
          nextPosition.width = widget.width;

          widget.setPosition(nextPosition);
          rendering.setWidgetPosition(widget.id, nextPosition);
        } else {
          widget.setPosition(GridArea.empty);
          rendering.setWidgetPosition(widget.id, GridArea.empty);
        }
      }
      
      function renderWithVariableSize(widget) {
        var nextPosition = rendering.getNextPosition();
                  
        if (nextPosition !== null) {
          widget.setPosition(nextPosition);
          rendering.setWidgetPosition(widget.id, nextPosition);
        } else {
          widget.setPosition(GridArea.empty);
          rendering.setWidgetPosition(widget.id, GridArea.empty);
        }
      }

      return rendering;
    }

    return service;
  });
})();
