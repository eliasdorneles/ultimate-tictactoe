var TicTacToeCtrl = function ($scope) {
    var PLAY_MARK = {
        empty: "empty",
        X: "markX",
        O: "markO"
    }

    var BOARD_STATES = {
        OPEN: "board-open",
        LOCKED: "board-locked"
    }

    function createMiniBoard() {
        var boardRepr = [];
        boardRepr.push([PLAY_MARK.empty, PLAY_MARK.empty, PLAY_MARK.empty]);
        boardRepr.push([PLAY_MARK.empty, PLAY_MARK.empty, PLAY_MARK.empty]);
        boardRepr.push([PLAY_MARK.empty, PLAY_MARK.empty, PLAY_MARK.empty]);
        return {
            state: BOARD_STATES.OPEN,
            winner: undefined,
            repr: boardRepr
        };
    }

    function createParentBoard() {
        var parentBoard = [];
        parentBoard.push([createMiniBoard(), createMiniBoard(), createMiniBoard()]);
        parentBoard.push([createMiniBoard(), createMiniBoard(), createMiniBoard()]);
        parentBoard.push([createMiniBoard(), createMiniBoard(), createMiniBoard()]);
        return parentBoard;
    }

    $scope.parentBoard = createParentBoard();

    $scope.playerX = {
        name: 'Player X',
        mark: PLAY_MARK.X
    };
    $scope.playerO = {
        name: 'Player O',
        mark: PLAY_MARK.O
    };

    $scope.currentPlayer = $scope.playerX;

    $scope.lastPlay = undefined;

    $scope.gameOver = false;

    $scope.previousGames = [];

    function currentGameAsJson() {
        var filterHashKeys = function (key, val) {
            return (key == '$$hashKey') ? undefined : val;
        };
        return JSON.stringify({
            board: $scope.parentBoard,
            currentPlayer: $scope.currentPlayer.mark,
            gameOver: $scope.gameOver
        }, filterHashKeys);
    }

    function restoreGameFromJson(str) {
        var parsed = JSON.parse(str);
        $scope.parentBoard = parsed.board;
        $scope.currentPlayer = ($scope.playerX.mark == parsed.currentPlayer) ? $scope.playerX : $scope.playerO;
        $scope.gameOver = parsed.gameOver;
        console.log('Game restored');
    }

    $scope.saveGame = function () {
        $scope.saved = currentGameAsJson();
        console.log('Game saved');
    }

    $scope.restoreGame = function () {
        if ($scope.saved) {
            restoreGameFromJson($scope.saved);
        } else {
            console.log('No game previously saved');
        }
    };

    $scope.undoLastPlay = function() {
        if ($scope.previousGames.length) {
            restoreGameFromJson($scope.previousGames.pop());
        } else {
            console.log('No previously game saved');
        }
    }

    function isBoardFull(boardY, boardX) {
        var parentBoardRepr = $scope.parentBoard[boardY][boardX].repr;
        for (var i = 0; i < parentBoardRepr.length; i++) {
            var lineBoard = parentBoardRepr[i];
            for (var j = 0; j < lineBoard.length; j++) {
                if (lineBoard[j] == PLAY_MARK.empty) {
                    return false;
                }
            }
        }
        return true;
    }

    function isValidPlay(boardY, boardX, y, x) {
        var currentMark = $scope.parentBoard[boardY][boardX].repr[y][x];
        if ($scope.lastPlay && $scope.parentBoard[boardY][boardX].state == BOARD_STATES.LOCKED) {
            return false;
        }
        return currentMark == PLAY_MARK.empty;
    }

    function lockInvalidBoards(y, x) {
        var isNextBoardAlreadyFull = isBoardFull(y, x);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (isNextBoardAlreadyFull) {
                    $scope.parentBoard[i][j].state = (i == y && j == x) ? BOARD_STATES.LOCKED : BOARD_STATES.OPEN;
                } else {
                    $scope.parentBoard[i][j].state = (i == y && j == x) ? BOARD_STATES.OPEN : BOARD_STATES.LOCKED;
                }
            }
        }
    }

    function lockAllBoards(y, x) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                $scope.parentBoard[i][j].state = BOARD_STATES.LOCKED;
            }
        }
    }

    function areAllEqual() {
        var firstArgument = arguments[0];
        return _.every(arguments, function (it) {
            return firstArgument == it;
        })
    }

    function checkDiagonals(matrix, item) {
        return areAllEqual(matrix[0][0], matrix[1][1], matrix[2][2], item) ||
            areAllEqual(matrix[0][2], matrix[1][1], matrix[2][0], item);
    }

    function checkHorizontals(matrix, item) {
        return areAllEqual(matrix[0][0], matrix[0][1], matrix[0][2], item) ||
            areAllEqual(matrix[1][0], matrix[1][1], matrix[1][2], item) ||
            areAllEqual(matrix[2][0], matrix[2][1], matrix[2][2], item);
    }

    function checkVerticals(matrix, item) {
        return areAllEqual(matrix[0][0], matrix[1][0], matrix[2][0], item) ||
            areAllEqual(matrix[0][1], matrix[1][1], matrix[2][1], item) ||
            areAllEqual(matrix[0][2], matrix[1][2], matrix[2][2], item);
    }

    function playWinsBoard(boardY, boardX) {
        var board = $scope.parentBoard[boardY][boardX];
        if (board.winner) {
            // board already has a winner...
            return false;
        }
        var matrix = board.repr;
        return checkDiagonals(matrix, $scope.currentPlayer.mark) ||
            checkHorizontals(matrix, $scope.currentPlayer.mark) ||
            checkVerticals(matrix, $scope.currentPlayer.mark);
    }

    function playWinsGame() {
        var matrix = _.map($scope.parentBoard, function (line) {
            return _.map(line, function (board) {
                return board.winner ? board.winner.replace('won-', '') : undefined;
            })
        });
        return checkDiagonals(matrix, $scope.currentPlayer.mark) ||
            checkHorizontals(matrix, $scope.currentPlayer.mark) ||
            checkVerticals(matrix, $scope.currentPlayer.mark);
    }

    $scope.play = function (boardY, boardX, y, x) {
        if (!isValidPlay(boardY, boardX, y, x)) {
            console.log('Invalid play');
            return;
        }
        $scope.previousGames.push(currentGameAsJson());

        $scope.parentBoard[boardY][boardX].repr[y][x] = $scope.currentPlayer.mark;

        if (playWinsBoard(boardY, boardX)) {
            $scope.parentBoard[boardY][boardX].winner = 'won-' + $scope.currentPlayer.mark;
        }
        if (playWinsGame()) {
            $scope.gameOver = true;
            lockAllBoards();
            return;
        }

        $scope.currentPlayer = ($scope.currentPlayer == $scope.playerX) ? $scope.playerO : $scope.playerX;
        $scope.lastPlay = { y: y, x: x }

        lockInvalidBoards(y, x);
    };
}
