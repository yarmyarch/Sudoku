/**
 * Board-related algorithm and methods.
 */
var Sudoku = Sudoku || {};
Sudoku.Board = (function() {
    var self;
    
    var LC = {
        MAP_EN : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(''),
        MAP_DE : {},
        MATRIX : "BQMEBgcICQECBgcCAQkFAwQIAQkIAwQCBQYHCAUJBwYBBAIDBAIGCAUDBwkBBwEDCQIECAUGCQYBBQMHAggEAggHBAEJBgMFAwQFAggGAQcJAA==",
        BLANK_RATE : 0.18
    };
    
    // initialize map for base64.
    for(var i = 0; i < 64; i++)
        LC.MAP_DE[LC.MAP_EN[i]] = i;
    
    var util = {
        base64Decode : function(str) {
            var buf = [],
                arr = str.split(''),
                map = LC.MAP_DE,
                n = arr.length,
                val,
                i=0;

            if(n % 4) return false;

            while(i < n) {
                val = (map[arr[ i ]] << 18) |
                    (map[arr[i+1]] << 12) |
                    (map[arr[i+2]] << 6)  |
                    (map[arr[i+3]]);

                buf.push(val>>16, val>>8 & 0xFF, val & 0xFF);
                i += 4;
            }

            while(arr[--n] == '=')
                buf.pop();

            return buf;
        }
    };
    
    // Magic, I can't tell what's it doing lol.
    
    return self = {
        /**
         * create a new random matrix.
         */
        generateNew : function() {
            var seed = [1,2,3,4,5,6,7,8,9],
                // random index
                ri = 0,
                len = seed.length,
                matrix = util.base64Decode(LC.MATRIX);
            // shuffle
            for (var i in seed) {
                ri = ~~(Math.random() * len);
                if (i != ri) {                    
                    seed[i] = seed[ri] ^ seed[i];
                    seed[ri] = seed[ri] ^ seed[i];
                    seed[i] = seed[ri] ^ seed[i];
                }
            }
            // generate new matrix with the original one encoded in base64.
            for (var i in matrix) {
                matrix[i] && (matrix[i] = seed[matrix[i] - 1]);
            }
            return matrix;
        },
        
        /**
         * Actually this function shoud work to check if the generated puzzle is having the unique solution. 
         * For a simplified solution, we just remove numbers randomly.
         */
        getRiddle : function(matrix) {
            var riddle = matrix.concat(),
                blankRate = LC.BLANK_RATE;
            
            for (var i in riddle) {
                riddle[i] = (Math.random() < blankRate) && riddle[i] || 0;
            }
            return riddle;
        },
        
        /**
         * return a random tip from current riddle and the correct matrix.
         */
        getNext : function(matrix, riddle) {
            var tipIndexes = [],
                index = 0;
            
            for (var i in riddle) {
                if (riddle[i] != matrix[i]) tipIndexes.push(i);
            }
            index = ~~(Math.random() * tipIndexes.length);
            return {
                index : tipIndexes[index],
                value : matrix[tipIndexes[index]]
            }
        },
        
        isConflict : function(index, value, status) {
            var xIndex = ~~(index / 9) * 9,
                yIndex = index % 9,
                x, y;
            
            for (var i = 0; i < 9; ++i) {
                // ignore itself.
                x = i + xIndex;
                y = (i * 9 + yIndex) % 81;
                if (index != x && +value == +status[x]) return true;
                if (index != y && +value == +status[y]) return true;
            }
            
            return false;
        }
    }
})();