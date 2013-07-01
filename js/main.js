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
        name: 'X',
        mark: PLAY_MARK.X
    };
    $scope.playerO = {
        name: 'O',
        mark: PLAY_MARK.O
    };

    $scope.currentPlayer = $scope.playerX;

    $scope.lastPlay = undefined;

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

    $scope.play = function (boardY, boardX, y, x) {
        if (!isValidPlay(boardY, boardX, y, x)) {
            console.log('Invalid play');
            return;
        }
        $scope.parentBoard[boardY][boardX].repr[y][x] = $scope.currentPlayer.mark;

        // TODO: se board atual teve game over, botar fundo com cor do jogador atual

        $scope.currentPlayer = ($scope.currentPlayer == $scope.playerX) ? $scope.playerO : $scope.playerX;
        $scope.lastPlay = { y: y, x: x }

        lockInvalidBoards(y, x);
    };
}