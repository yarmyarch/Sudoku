/**
 * General functions.
 * @author yarmyarch@live.cn
 */
var Sudoku = Sudoku || {};
Sudoku.Util = (function(){
    
    var self;
    
    var buf = {
        // buffered element list.
        elemList : {}
    };
    
    return self = {
        
        /**
         * get element by id.
         */
        g : function(id, updateBuffer) {
            
            if (updateBuffer) return buf.elemList[id] = document.getElementById(id);
            return buf.elemList[id] ? buf.elemList[id] : (buf.elemList[id] = document.getElementById(id));
        }
    };
})();