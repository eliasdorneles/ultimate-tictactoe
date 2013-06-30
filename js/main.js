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

    function isValidPlay(bbY, bbX, y, x) {
        var currentMark = $scope.bigBoard[bbY][bbX].repr[y][x];
        if ($scope.lastPlay) {
            // TODO: se estiver cheio, deixar passar
            if (bbY != $scope.lastPlay.y || bbX != $scope.lastPlay.x) {
                return false;
            }
        }
        return currentMark == marks.empty;
    }

    $scope.play = function (bbY, bbX, y, x) {
        console.log('lastPlay', $scope.lastPlay);
        if (!isValidPlay(bbY, bbX, y, x)) {
            console.log('Invalid play');
            return;
        }
        $scope.bigBoard[bbY][bbX].repr[y][x] = $scope.currentPlayer.mark;

        // TODO: bloquear todos os boards, liberar y, x
        // TODO: detectar se board teve game over

        $scope.currentPlayer = ($scope.currentPlayer == $scope.playerX) ? $scope.playerO : $scope.playerX;
        $scope.lastPlay = { y: y, x: x }

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                $scope.bigBoard[i][j].state = (i == y && j == x) ? boardState.OPEN : boardState.LOCKED;
            }
        }
    };
}