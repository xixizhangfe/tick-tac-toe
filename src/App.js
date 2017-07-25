import React from 'react';
import './App.css';

class Square extends React.Component{
  render() {
    return (
      <button className="suqare" onClick={this.props.onClick}>{this.props.clickCount}</button>
    )
  }
      
}

class Board extends React.Component {
      renderSquare(i) {
        return (
          <Square clickCount={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>
        )
      }
      
      
      render(){
        let arr = [];
        let cell = [];
        let cellNum=0;
        const rows = 3;
        const cols = 3;
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            cell.push(this.renderSquare(cellNum));
            cellNum++;
          }
          arr.push(<div className="square-row">{cell}</div>);
          cell =[];
        }

        return (
          <div className="wrapper">
            {arr}
          </div>
        )
      }
      
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        clickNum:''
       }
       ],
      stepNumber:0,
      isNext: true, // 默认是true
      selected: Array(9).fill(null)
    }
  }
  
  handleClick(i,event) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // 这里为啥多列isNext呢，是因为每次点击后，我们的下一个输入值需要切换，一开始想到用数组，切换状态不太好，所以就用0，1变量来切换，这是最好的。
    squares[i] = this.state.isNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        clickNum: i+1
      }]),
      stepNumber: history.length,
      isNext: !this.state.isNext
    });
  }

  jumpTo(step) {
    let selected = this.state.selected.splice();
    selected = new Array(9);
    selected[step] = true;
    this.setState({
      stepNumber: step,
      isNext: (step % 2) === 0,
      selected: selected
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      let pos_x, pos_y;
      const clickNum = step.clickNum;
      if(clickNum) {
        pos_x = Math.ceil(clickNum / 3);
        pos_y = clickNum % 3 ===0 ? 3 : clickNum % 3;
      }
      const desc = move ?
        'Move # (' + pos_x + "," + pos_y + ")" :
        'Game start';
      return (
        <li key={move}>
          <a href="#" className={this.state.selected[move] ? 'selected' : ''} onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    })
    let status;
    if(winner) {
      status = 'Winner' + winner;
    } else {
      status = 'Next player: ' + (this.state.isNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
        const lines = [
          [0,1,2],
          [3,4,5],
          [6,7,8],
          [0,3,6],
          [1,4,7],
          [2,5,8],
          [0,4,8],
          [2,4,6]
        ];

        for(let i=0; i<lines.length; i++) {
          const [a,b,c] = lines[i];
          if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
            return squares[a];
          }
        }
        return null;
      }


export default Game;
