// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    getColumn: function(colIndex){
      var n = this.get('n');
      var rows = this.rows();
      var column = [];

      for(var row = 0; row < n; row++){
        column.push(rows[row][colIndex]);
      }
      return column;
    },

    columns: function(){
      var n = this.get('n');
      var columns = [];
      for(var i = 0; i < n; i++){
        columns.push(this.getColumn(i));
      }
      return columns;
    },

    counterRot: function() {
      var n = this.get('n');
      var matrix = this.rows();
      var tempArr = [];
      var result = [];
      var colItem;

      for(var col = 0; col < n; col++){
        for(var row = 0; row < n; row++){
          colItem = [row][col]
          tempArr.push(colItem);
        }
        result.push(tempArr);
        tempArr = [];
      }
      return result = result.reverse();
    },

    getMajor: function(colOfRowIndex){
      var n = this.get('n');
      var matrix = this.rows();
      var diagonal = [];
      var len;
      var row = 0;
      if(colOfRowIndex < 0){
        row = Math.abs(colOfRowIndex);
        len = n;
      } else {
        row = 0;
        len = n - colOfRowIndex;
      }
      for(; row < len; row++){
        diagonal.push(matrix[row][colOfRowIndex + row]);
      }
      return diagonal;
    },

    majors: function(){
      var result = [];
      var n = this.get('n');
      var len = n * 2;
      var i = -(n);
      for(var i = 0; i < len; i++){
        result.push(getMajor(i));
      }
      return result;
    },

    getMinor: function(index){
      var n = this.get('n');
      var matrix = this.rows();
      var diagonal = [];
      var len;
      var row = 0;
      var col;

      if(index < 0){
        row = Math.abs(index) ;
        len = n;
      } else {
        row = 0;
        len = index + 1;
      }

      if(index >= 0 && index < n){
        col = index;
        for(; row < len; row++){
          diagonal.push(matrix[row][col--]);
        }
      } else {
        if(index < 0 && index > -(n)){
          col = n - 1;
          for(; row < len; row++){
            diagonal.push(matrix[row][col--]);
          }
        }
      }

      return diagonal;
    },

    minors: function(){
      var result = [];
      var n = this.get('n');
      var len = n * 2;
      var i = -(n);
      for(var i = 0; i < len; i++){
        result.push(getMinor(i));
      }
      return result;
    },

    hasConflict: function(array){
      var hasPiece = false;
      var hasConflict = false;
      for(var i = 0; i < array.length; i++){
        if(array[i] === 1 && hasPiece){
          hasConflict = true;
        } else if(array[i] === 1){
          hasPiece = true;
        }
      }
      return hasConflict;
    },


    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      var hasPiece = false;
      var hasConflict = false;

      for(var i = 0; i < row.length; i++){
        if(row[i] === 1 && hasPiece){
          hasConflict = true;
        } else if(row[i] === 1){
          hasPiece = true;
        }

      }
      return hasConflict; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      var n = this.get('n');
      var hasAnyConflict = false;
      for(var row = 0; row < n; row++){
        hasAnyConflict = this.hasRowConflictAt(row) || hasAnyConflict;
      }
      return hasAnyConflict;
    },


    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var n = this.get('n');
      var hasPiece = false;
      var hasConflict = false;
      var column = this.getColumn(colIndex);

      for(var i = 0; i < n; i++){
        if(column[i] === 1 && hasPiece){
          hasConflict = true;
        } else if(column[i] === 1){
          hasPiece = true;
        }
      }

      return hasConflict; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var columns = this.columns();
      var n = this.get('n');
      var anyConflict = false;

      for(var c = 0; c < n; c++){
        anyConflict = this.hasColConflictAt(c) || anyConflict;
      }

      return anyConflict; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(col) {//param: majorDiagonalColumnIndexAtFirstRow

      // need t account for negative column indexes
      var result = false;
      var n = this.get('n');
      if ( col < n ){
        var diagonal = this.getMajor(col);
        result = this.hasConflict(diagonal);
      }

      return result; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var hasConflict = false;
      var n = this.get('n');

      var len = 2 * n;
      var i = -(n);
      for(; i < len; i++){
        hasConflict = this.hasMajorDiagonalConflictAt(i) || hasConflict;
      }
      return hasConflict; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(index) {//minorDiagonalColumnIndexAtFirstRow
      var result = false;
      var n = this.get('n');
      if ( index < n ){
        var diagonal = this.getMinor(index);
        result = this.hasConflict(diagonal);
      }

      return result; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var hasConflict = false;
      var n = this.get('n');

      var len = 2 * n;
      var i = -(n);
      for(; i < len; i++){
        hasConflict = this.hasMinorDiagonalConflictAt(i) || hasConflict;
      }
      return hasConflict; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
