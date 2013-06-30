var TicTacToeCtrl = function ($scope) {
    var marks = {
        empty: "empty",
        X: "markX",
        O: "markO"
    }
    const CENTER = 1;
    const LEFT = 0;
    const RIGHT = 2;
    const TOP = 0;
    const BOTTOM = 2;

    var boardState = {
        OPEN: "board-open",
        LOCKED: "board-locked"
    }

    function createMiniBoard() {
        var boardRepr = [];
        boardRepr.push([marks.empty, marks.empty, marks.empty]);
        boardRepr.push([marks.empty, marks.empty, marks.empty]);
        boardRepr.push([marks.empty, marks.empty, marks.empty]);
        return {
            state: boardState.OPEN,
            repr: boardRepr
        };
    }

    function createBigBoard() {
        var bigBoard = [];
        bigBoard.push([createMiniBoard(), createMiniBoard(), createMiniBoard()]);
        bigBoard.push([createMiniBoard(), createMiniBoard(), createMiniBoard()]);
        bigBoard.push([createMiniBoard(), createMiniBoard(), createMiniBoard()]);
        return bigBoard;
    }

    $scope.bigBoard = createBigBoard();

    $scope.playerX = {
        name: 'X',
        mark: marks.X
    };
    $scope.playerO = {
        name: 'O',
        mark: marks.O
    };

    $scope.currentPlayer = $scope.playerX;

    $scope.lastPlay = undefined;

    function isBoardFull(bbY, bbX) {
        var bigboardRepr = $scope.bigBoard[bbY][bbX].repr;
        for (var i = 0; i < bigboardRepr.length; i++) {
            var lineBoard = bigboardRepr[i];
            for (var j = 0; j < lineBoard.length; j++) {
                if (lineBoard[j] == marks.empty) {
                    return false;
                }
            }
        }
        return true;
    }

    function isValidPlay(bbY, bbX, y, x) {
        var currentMark = $scope.bigBoard[bbY][bbX].repr[y][x];
        if ($scope.lastPlay && $scope.bigBoard[bbY][bbX].state == boardState.LOCKED) {
            return false;
        }
        return currentMark == marks.empty;
    }

    function lockInvalidBoards(y, x) {
        var isNextBoardAlreadyFull = isBoardFull(y, x);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (isNextBoardAlreadyFull) {
                    $scope.bigBoard[i][j].state = (i == y && j == x) ? boardState.LOCKED : boardState.OPEN;
                } else {
                    $scope.bigBoard[i][j].state = (i == y && j == x) ? boardState.OPEN : boardState.LOCKED;
                }
            }
        }
    }

    $scope.play = function (bbY, bbX, y, x) {
        if (!isValidPlay(bbY, bbX, y, x)) {
            console.log('Invalid play');
            return;
        }
        $scope.bigBoard[bbY][bbX].repr[y][x] = $scope.currentPlayer.mark;

        // TODO: detectar se board teve game over

        $scope.currentPlayer = ($scope.currentPlayer == $scope.playerX) ? $scope.playerO : $scope.playerX;
        $scope.lastPlay = { y: y, x: x }

        lockInvalidBoards(y, x);
    };
}