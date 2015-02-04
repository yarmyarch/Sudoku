/**
 * Public interfaces.
 * @author yarmyarch@live.cn
 */
var Sudoku = Sudoku || {};
Sudoku.page = (function() {
    var self,
        _s = Sudoku;
    
    // private attributes and buffers.
    var buf = {
        tipTimer : 0,
        
        matrix : null,
        riddle : null,
        status : null,
        
        activedIndex : 1,
        historyStack : [],
        
        // 10s at the first time.
        tipTick : 10,
        tipCount : 0,
        tipTimer : 0,
        
        actionOpened : false,
        
        // cached dom list, indexed by id.
        pixelElems : {}
    };
    
    // private methods.
    var controller = {
        /**
         * create a blank board, preparing to accept data.
         * initially hidden.
         */
        initBoard : function() {
            var pixelCount = 0,
                fragment = document.createDocumentFragment(),
                bufDiv = document.createElement("div"),
                htmlContent = [],
                pixelContent,
                _lc = _s.LocalConfig,
                _buf = buf;
            
            for (var i = 0; i < 9; ++i) {
                pixelContent = [];
                for (var j = 0; j < 9; ++j) {
                    pixelContent.push(_lc.HTML.PIXEL
                        .replace(/%id%/, i * 9 + j)
                        .replace(/%pos%/, _lc.CLASS_NAME.V_ALIGN[~~(j / 3)] + " " + _lc.CLASS_NAME.H_ALIGN[j % 3])
                    );
                }
                htmlContent.push(_lc.HTML.PANEL
                    .replace(/%pixel%/, pixelContent.join(""))
                    .replace(/%pos%/, _lc.CLASS_NAME.V_ALIGN[~~(i / 3)] + " " + _lc.CLASS_NAME.H_ALIGN[i % 3])
                );
            }
            bufDiv.innerHTML = htmlContent.join("");
            fragment.appendChild(bufDiv);
            _s.Util.g(_lc.ID.SUDOKU_WRAP).appendChild(fragment);
            
            // init dom elements for buffer.
            for (var i = 0; i < 81; ++i) {
                _buf.pixelElems[i] = _s.Util.g(_lc.ID.PRE_PIXEL + i);
            }
        },
        
        fillBoard : function(riddle) {
            var value = 0,
                _u = _s.Util,
                _lc = _s.LocalConfig,
                _buf = buf,
                elem;
            
            // remove "blank" tag and fillin the value.
            for (var i in riddle) {
                if (value = riddle[i]) {
                    elem = _buf.pixelElems[i];
                    elem.parentNode.className = elem.parentNode.className.replace(/\s+(blank)|(init)/g, "") + " init";
                    elem.innerHTML = riddle[i];
                }
            }
            
            // reset status buffer to riddle.
            _buf.status = riddle.concat();
        },
        
        fadeIn : function() {
            
            var left = 0,
                top = 0,
                elems = buf.pixelElems,
                _lc = _s.LocalConfig,
                randTime = 0,
                elem;
            
            for (var i in elems) {
                left = ~~((Math.random() - 0.5) * _lc.JUMP_RANGE);
                top = ~~((Math.random() - 0.5) * _lc.JUMP_RANGE);
                randTime = ~~(Math.random() * _lc.JUMP_TICK);
                elem = elems[i].parentNode;
                
                // ready,
                elem.className = elem.className.replace(/\s+hidden/, "") + " fadeout";
                // set all nodes to a random place first.
                elem.style.left = left + "px";
                elem.style.top = top + "px";
                
                // go!
                setTimeout((function(i) {
                    return function() {
                        elem = elems[i].parentNode;
                        elem.className = elem.className.replace(/\s+fadeout/, "");
                        // show it.
                        elem.style.left = "0px";
                        elem.style.top = "0px";
                    };
                })(i), randTime);
            }
        },
        
        fadeOut : function() {
            
            var left = 0,
                top = 0,
                elems = buf.pixelElems,
                _lc = _s.LocalConfig,
                randTime = 0,
                elem;
            
            for (var i in elems) {
                left = ~~((Math.random() - 0.5) * _lc.JUMP_RANGE);
                top = ~~((Math.random() - 0.5) * _lc.JUMP_RANGE);
                randTime = ~~(Math.random() * _lc.JUMP_TICK);
                elem = elems[i].parentNode;
                
                // ready,
                elem.className = elem.className + " fadeout";
                elem.style.left = left + "px";
                elem.style.top = top + "px";
                
                // go!
                setTimeout((function(i) {
                    return function() {
                        elems[i].parentNode.className = elems[i].parentNode.className.replace(/\s+fadeout/, "") + " hidden";
                    };
                })(i), randTime);
            }
        },
        
        clear : function() {
            // clear the current board.
            var elems = buf.pixelElems;
            
            for (var i in elems) {
                elems[i].parentNode.className = elems[i].parentNode.className.replace(/\s+(blank)|(init)/, "") + " blank";
                elems[i].innerHTML = "";
            }
        },
        
        // fill data and fade in.
        start : function() {
            
            var _c = controller,
                _buf = buf,
                _b = _s.Board,
                timeout = 0;
            
            _buf.matrix = _b.generateNew();
            _buf.riddle = _b.getRiddle(_buf.matrix);
            
            _c.fillBoard(_buf.riddle);
            _c.fadeIn();
        },
        
        startTipTick : function() {
            var _buf = buf,
                _u = _s.Util,
                _lc = _s.LocalConfig,
                button = _u.g(_lc.ID.ACTION_SHOWTIP),
                tick = _u.g(_lc.ID.TIME_TIP);
            
            clearInterval(_buf.tipTimer);
            ++_buf.tipCount;
            _buf.tipTick = _buf.tipCount * _lc.TIP_TICK;
            
            // show seconds remainning.
            tick.innerHTML = "(" + _buf.tipTick + ")";
            button.className = button.className.replace(/\s+disabled/g, "") + " disabled";
            
            _buf.tipTimer = setInterval(function() {
                _buf.tipTick--;
                if (_buf.tipTick > 0) {
                    button.className = button.className.replace(/\s+disabled/g, "") + " disabled";
                    tick.innerHTML = "(" + _buf.tipTick + ")";
                } else {
                    button.className = button.className.replace(/\s+disabled/g, "");
                    tick.innerHTML = "";
                    clearInterval(_buf.tipTimer);
                }
            }, 1000);
        },
        
        restartTipTick : function() {
            var _buf = buf;
            
            clearInterval(_buf.tipTimer);
            _buf.tipCount = 0;
            controller.startTipTick();
        },
        
        initEvents : function() {
            
            var _u = _s.Util,
                _lc = _s.LocalConfig,
                _buf = buf;
            
            // active numbers for input.
            for (var i = 1; i <= 9; ++i) {
                _u.g(_lc.ID.PRE_PIXEL_BUTTON + i).onclick = (function(i) {
                    return function() {
                        var elem = _u.g(_lc.ID.PRE_PIXEL_BUTTON + _buf.activedIndex);
                        
                        // disactve the current number.
                        elem.className = elem.className.replace(/\s+active/, "");
                        
                        // reactive new number.
                        _buf.activedIndex = i;
                        elem = _u.g(_lc.ID.PRE_PIXEL_BUTTON + _buf.activedIndex);
                        elem.className = elem.className.replace(/\s+active/, "") + " active";
                    }
                })(i);
            }
            
            // pixel cells react mouse events
            for (var i = 0; i < 81; ++i) {
                _u.g(_lc.ID.PRE_PIXEL + i).onmouseover = (function(i) {
                    return function() {
                        // if there exist a actived number that's waiting to be placed, try previewing it.
                        // do nothing if it's a initilizing pixel.
                        if (_buf.riddle[i]||  _buf.status[i] == _buf.activedIndex) {
                            return;
                        }
                        if (_buf.activedIndex) {
                            var elem = _u.g(_lc.ID.PRE_PIXEL + i);
                            elem.parentNode.className = elem.parentNode.className.replace(/\s+(preview)|(blank)|(conflict)/g, "") + " preview";
                            elem.innerHTML = _buf.activedIndex;
                        }
                        
                        if (_s.Board.isConflict(i, _buf.activedIndex, _buf.status)) {
                            elem.parentNode.className = elem.parentNode.className.replace(/\s+conflict/g, "") + " conflict";
                        }
                    };
                })(i);
                
                // restore the cell to it's status before previewing.
                _u.g(_lc.ID.PRE_PIXEL + i).onmouseout = (function(i) {
                    return function() {
                        if (_buf.riddle[i] || _buf.status[i] == _buf.activedIndex) {
                            return;
                        }
                        var elem = _u.g(_lc.ID.PRE_PIXEL + i);
                        elem.parentNode.className = elem.parentNode.className.replace(/\s+(preview)|(conflict)/g, "") + (!(_buf.status[i]) ? " blank" : "");
                        elem.innerHTML = _buf.status[i] || "";
                        
                        if (_buf.status[i] && _s.Board.isConflict(i, _buf.status[i], _buf.status)) {
                            elem.parentNode.className = elem.parentNode.className.replace(/\s+conflict/g, "") + " conflict";
                        }
                    };
                })(i);
                
                // try update the board for input.
                _u.g(_lc.ID.PRE_PIXEL + i).onclick = (function(i) {
                    return function() {
                        // restore the cell to it's status before previewing.
                        if (_buf.riddle[i] ||  _buf.status[i] == _buf.activedIndex) {
                            return;
                        }
                        if (_buf.activedIndex) {
                            var elem = _u.g(_lc.ID.PRE_PIXEL + i),
                                historyElem;
                            
                            elem.parentNode.className = elem.parentNode.className.replace(/\s+(preview)|(blank)|(conflict)/g, "");
                            elem.innerHTML = _buf.activedIndex;
                            
                            // record and update history.
                            var level = _lc.MAX_HISTORY;
                            _buf.historyStack.push(i);
                            for (var k = _buf.historyStack.length - 1; k >= 0; --k, --level) {
                                historyElem = _u.g(_lc.ID.PRE_PIXEL + _buf.historyStack[k]);
                                historyElem.parentNode.className = 
                                    historyElem.parentNode.className.replace(/\s+pixel-level-\d+/g, "") + " pixel-level-" + level;
                            }
                            
                            if (_buf.historyStack.length > _lc.MAX_HISTORY) {
                                _buf.historyStack.shift();
                            }
                            
                            // conflict check
                            if (_s.Board.isConflict(i, _buf.activedIndex, _buf.status)) {
                                elem.parentNode.className = elem.parentNode.className.replace(/\s+(conflict)/g, "") + " conflict";
                            } else {
                                controller.checkWin();
                            }
                            
                            // update status buffer.
                            _buf.status[i] = _buf.activedIndex;
                        }
                    };
                })(i);
            };
            
            // set action buttons.
            _u.g(_lc.ID.ACTION_RESTART).onclick = function() {
                self.restart();
            };
            
            _u.g(_lc.ID.ACTION_RESET).onclick = function() {
                self.reset();
            };
            
            _u.g(_lc.ID.ACTION_RETREAT).onclick = function() {
                self.retreat();
            };
            
            _u.g(_lc.ID.ACTION_SHOWTIP).onclick = function() {
                self.showTip();
            };
            
            // open actions on mobile.
            _u.g(_lc.ID.EXPAND_BTN).onclick = function(e) {
                var e = e || window.event;
                e.stopPropagation && e.stopPropagation() || (e.cancelBubble = true);
                self.showActions();
            };
            
            // hide actions when any place clicked on the document.
            window.onclick = function() {
                self.hideActions();
            };
        },
        
        checkWin : function() {
            
            // check if the member win.
            var win = true,
                _buf = buf,
                _lc = _s.LocalConfig;
            
            for (var i = 0; i < 81; ++i) {
                if (!_buf.status[i]) {
                    win = false;
                    break;
                }
            }
            if (win && confirm(_lc.TEXT.SUCCESS)) {
                self.restart();
            }
        }
    };
    
    var init = function() {
        var _c = controller,
            _buf = buf,
            _b = _s.Board;
        
        _c.initBoard();
        _c.start();
        _c.startTipTick();
        _c.initEvents();
        
        return true;
    };
    
    self = {
        reset : function() {
            var _c = controller;
            _c.fadeOut();
            setTimeout(function() {
                _c.clear();
                _c.fillBoard(buf.riddle);
                _c.fadeIn();
                _c.restartTipTick();
            }, _s.LocalConfig.JUMP_TICK);
        },
        
        restart : function() {
            var _c = controller;
            _c.fadeOut();
            setTimeout(function() {
                _c.clear();
                _c.start();
                _c.restartTipTick();
            }, _s.LocalConfig.JUMP_TICK);
        },
        
        retreat : function() {
            if (confirm(_s.LocalConfig.TEXT.FAIL)) {
                window.location = _s.LocalConfig.AUTHOR;
            }
        },
        
        showTip : function() {
            if (buf.tipTick > 0) return;
            
            var _buf = buf,
                tip = _s.Board.getNext(_buf.matrix, _buf.riddle),
                _u = _s.Util,
                _lc = _s.LocalConfig,
                elem = _u.g(_lc.ID.PRE_PIXEL + tip.index);
            
            _buf.riddle[tip.index] = _buf.status[tip.index] = tip.value;
            // update view.
            elem.parentNode.className = elem.parentNode.className.replace(/\s+(preview)|(blank)|(conflict)/g, "");
            elem.innerHTML = tip.value;
            
            controller.checkWin();
            
            // show a tip and reset the timer.
            controller.startTipTick();
        },
        
        showActions : function() {
            var actionWrap = _s.Util.g(_s.LocalConfig.ID.ACTION_WRAP),
                height = actionWrap.scrollHeight;
            
            actionWrap.style.height = height + "px";
            
            buf.actionOpened = true;
        },
        
        hideActions : function() {
            if (buf.actionOpened) {
                _s.Util.g(_s.LocalConfig.ID.ACTION_WRAP).style.height = "0px";
                buf.actionOpened = false;
            }
        }
    };
    
    if (init()) {
        return self;
    }
})();

// let's gogogo!