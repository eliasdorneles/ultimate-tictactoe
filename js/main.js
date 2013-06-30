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
        OPEN: "open",
        LOCKED: "locked"
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

//    $scope.bigBoard[TOP][LEFT].repr[TOP][LEFT] = marks.X;
//    $scope.bigBoard[TOP][LEFT].repr[TOP][CENTER] = marks.O;
//
//    $scope.bigBoard[TOP][CENTER].repr[TOP][CENTER] = marks.O;
//    $scope.bigBoard[CENTER][CENTER].repr[CENTER][CENTER] = marks.X;
//    $scope.bigBoard[BOTTOM][RIGHT].repr[BOTTOM][RIGHT] = marks.X;
//    $scope.bigBoard[TOP][CENTER].repr[BOTTOM][LEFT] = marks.O;

    $scope.playerX = {
        name: 'X',
        mark: marks.X,
        lastPlay: undefined
    };
    $scope.playerO = {
        name: 'O',
        mark: marks.O,
        lastPlay: undefined
    };

    $scope.currentPlayer = $scope.playerX;

    $scope.play = function (bbY, bbX, x, y) {
        $scope.bigBoard[bbY][bbX].repr[y][x] = $scope.currentPlayer.mark;
        $scope.currentPlayer = ($scope.currentPlayer == $scope.playerX) ? $scope.playerO : $scope.playerX;
    };
}