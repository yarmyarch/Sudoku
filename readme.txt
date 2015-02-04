How to run:
    1. Open index.html with a browser(I may suggest Chrome, Safari, Opera, and IE10+);
    2. Select a number at the bottom( it's at the right side when under a mobile device);
    3. Fill the board with selected number.

Some tips:
    1. If the number selected is obviously a incorrect one, you'll get informed by a red colored text;
    2. You can track your filling history by background color of the numbers, that the latest filled number is having a darker background.
    3. Use hints whenever it's avaliable!
    4. Reset will clean the board, while Restart will generate a new board.

Structure:
    -asset : the file that would be lunched on the server, with fully compressed javascript and css files.
        -js
        -css
    -src : source files, including SASS files together with css files. Using Koala for compiling.
        -js
        -css
    -asset.bak : backup files for the original version of assets. These files will try to include src js and css files on testing environment, so it would be possible debuging with source files.
        -asset
            ...
    -tool : nothing much to tell about.
        -yuicompressor
    -build.sh : I'm using shell for compressing and mixing, as when running in a integrated environment, it could be expanded easily with unit tests and other compiling processes.
    -index.html

Techs & Libs:
    1. SASS;
    2. Nothing else.
        Sass is good for repetitive css work, especially when there exist be many places where browser-specific prefixes should be used. At this time I'm not using animation-key-frames, but if I do, there could be more css required for that case. That's always why Sass would be useful.
        I prefer using PURE javascript with some smarty tools for small projects, making it flexible and robust.

Improvements:
    1. Moduled programming: I'm using self-defined modules, just making it easier to be auto-run with shell. That's enough for small projects, however when the scale get bigger for sure that we should use moduled-scripting, like Require.js or Sea.js.
    2. MVVM : Actually the Sudoku chould be a perfect use case for MVVM, while the whole board could be data-driven. As an approvement, Angular could be used as it's not a quite huge site and the performance is acceptable. Or we can use Object.defineProperty/Object.obverse directly, creating a small util structing the project with data to create a 2-way binding.
    3. Back to the Sudoku itself, we're not recording status for the user. We can use LocalStorage creating a simplified data strcuture so the user can pause the game and repick it later.
    4. True-Ramdon Board: Now it's randomly generating puzzles, while there could be dulplicated solutions for a puzzle. That could be verified. Also it's creating puzzles from the existing one encoded in base64.
    5. More UI actions: Such as level-picking, color-switching, and so on.

Github page：
    http://www.github.com/yarmyarch/sudoku
    http://yarmyarch.github.io/Sudoku/

Best Regards!
Yujia