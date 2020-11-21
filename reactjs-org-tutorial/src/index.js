import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    var classNames = "square";
    if (props.winningSquare) {
        classNames += " win"
    }

    return (
        <button className={classNames} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        var isWinningSquare = this.props.winner && this.props.winner.includes(i);

        return (
            <Square value={this.props.squares[i]} winningSquare={isWinningSquare}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(row) {
        const cells = []
        for (let cell = 0; cell < 3; cell++) {
            cells.push(this.renderSquare((row * 3) + cell))
        }
        return (
            <div className="board-row">
                {cells}
            </div>
        )
    }

    // this.state 가 바뀔 때마다 render()가 매번 호출된다.
    render() {
        const rows = []
        for (let row = 0; row < 3; row++) {
            rows.push(this.renderRow(row))
        }
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice(); // 새로운 squares 배열 복제/생성.

        // 승자가 있거나, 이미 클릭한 곳이거나(squares[i])
        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            moveOrder: 'asc',
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2 ) === 0,
        });
    }

    handleMoveOrder(type) {
        this.setState({ moveOrder: type });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // history 가 <li> 컴포넌트로 mapping 된다.
        let moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            const selectedClass = (move === this.state.stepNumber) ? "selected" : "";
            console.log("step : " + step + ", stepNumber : " + this.state.stepNumber);
            return (
                <li key={move} className={selectedClass}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        if (this.state.moveOrder === 'desc') {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else if (this.state.stepNumber === 9) {
            status = 'Winner: 무승부';
        } else {
            status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>
                        <button onClick={() => this.setState({ moveOrder: 'asc' })}>오름차순</button>
                        <button onClick={() => this.setState({ moveOrder: 'desc' })}>내림차순</button>
                    </div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ==================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        // 가로
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // 세로
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // 대각선
        [0, 4, 8],
        [2, 4, 6],
    ];

    // 가로/세로/대각선이 모두 동일한 값이 되면 해당 값이 승자
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            // 이부분에서 승자가 결정되므로, a, b, c 가 승자 칸임을 알 수 있음.
            return [a, b, c];
        }
    }
    return null;
}
