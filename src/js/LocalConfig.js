/**
 * configurations such as languages, if required.
 * @author yarmyarch@live.cn
 */
var Sudoku = Sudoku || {};
Sudoku.LocalConfig = (function(){
    
    var _u = Sudoku.Util;
    
    var self = {
        ID : {
            TITLE : "title",
            EXPAND_BTN : "expandBtn",
            
            ACTION_RESET : "actionReset",
            ACTION_RESTART : "actionRestart",
            ACTION_RETREAT : "actionRetreat",
            ACTION_SHOWTIP : "actionShowTip",
            
            TIME_TIP : "timeTip",
            TIME_PLAYED : "timePlayed",
            SUDOKU_WRAP : "sudokuWrap",
            ACTION_WRAP : "actionWrap",
            HTML_TEMP : "htmlTemplate",
            
            PRE_PIXEL : "pixel_",
            PRE_PIXEL_BUTTON : "pixelItem_"
        },
        
        CLASS_NAME : {
            V_ALIGN : ["align_top", "v_center", "align_bottom"],
            H_ALIGN : ["align_left", "h_center", "align_right"]
        },
        
        // would be generated from html file by given id.
        HTML : {
            PIXEL : "htmlPixels",
            PANEL : "htmlPanel"
        },
        
        MAX_HISTORY : 4,
        
        JUMP_RANGE : 120,
        JUMP_TICK : 600,
        
        TIP_TICK : 10,
        
        AUTHOR : "http://www.github.com/yarmyarch",
        
        TEXT : {
            FAIL : "Ahh, okay. Thanks for playing, what about checking something else that's more funny?",
            SUCCESS : "Wow! You must be kidding... Congratulations! Wanna try it again?"
        }
    };
    
    var init = function() {
        // get html content from template.
        var htmlTempNode = _u.g(self.ID.HTML_TEMP);
        for (var i in self.HTML) {
            self.HTML[i] = _u.g(self.HTML[i]).value;
        }
        htmlTempNode.parentNode.removeChild(htmlTempNode);
    };
    
    init();
    
    return self;
})();