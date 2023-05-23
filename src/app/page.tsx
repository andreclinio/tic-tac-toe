'use client'

import { useRef, useState } from 'react';
import { Mark, Value, ValueSet } from './logic/values';
import React from 'react';

interface CellProps {
  value: Value,
  clicked: () => void
}

function Cell(props: CellProps) {
  return (
    <div className='flex content-center justify-center'>
      <div className='flex flex-col content-center justify-center'>
        <span onClick={props.clicked}>{props.value ? props.value.icon : "-"} </span>
      </div>
    </div>
  )
}

interface BoardProps {
  onWinnerChanged: (winner: Mark) => void;
  onBadCellClicked: (player: Mark) => void;
  winner: Value;
  playing: boolean;
}

interface BoardState {
  valueSet: ValueSet;
  currentMark: Mark;
}

class Board extends React.Component<BoardProps, BoardState> {

  constructor(props: BoardProps) {
    super(props);
    this.state = { valueSet: ValueSet.create(), currentMark: Mark.X };
  }

  private clicked(i: number): void {
    if (!this.props.playing) return;
    if (this.props.winner) return;

    const valueSet = this.state.valueSet;
    const currentMark = this.state.currentMark;
    if (!valueSet.isFree(i)) {
      this.props.onBadCellClicked(currentMark);
      return;
    }

    const nextValueSet = valueSet.createPlay(i, currentMark);
    const winner = nextValueSet.calculateWinner();
    if (winner) {
      this.setState({ valueSet: nextValueSet }, () => this.props.onWinnerChanged(winner));
    }
    else {
      this.setState({ valueSet: nextValueSet, currentMark: currentMark.other() });
    }
  }

  start(): void {
    const initialMark = Mark.X;
    const emptyValueSet = ValueSet.create();
    const initialState: BoardState = { valueSet: emptyValueSet, currentMark: initialMark };
    this.setState(initialState);

  }

  quit(): void {
    const winner = this.state.currentMark.other();
    this.props.onWinnerChanged(winner);
  }

  render(): React.JSX.Element {
    const valueSet = this.state.valueSet;
    const cells = Array.from({ length: valueSet.length() }, (_, i) => i);
    return (
      <div className="grid grid-cols-3 gap-4 grow" >
        {cells.map(i => (<Cell key={i} value={valueSet.get(i)} clicked={() => this.clicked(i)}></Cell>))}
      </div >
    )
  }
};

interface HomeProps {
}

interface HomeState {
  playing: boolean;
  winner?: Mark;
}

export default function Home() {

  const [winner, setWinner] = useState<Value>(undefined);
  const [playing, setPlaying] = useState<boolean>(false);
  const boardRef = useRef<Board>(null);
  const onBadCellClicked = (p: Mark) => alert(`Bad ${p}`);
  const start = () => {
    if (boardRef.current) {
      boardRef.current.start();
      setPlaying(true);
      setWinner(undefined);
    }
    else alert("bad board-ref");
  }
  const quit = () => {
    if (boardRef.current) {
      boardRef.current.quit();
      setPlaying(false);
    }
    else alert("bad board-ref");
  }
  return (
    <div className="flex flex-col content-center justify-center" style={{ width: '100vw', height: '100vh' }}>
      <Board winner={winner} ref={boardRef}
        playing={playing}
        onWinnerChanged={(w) => setWinner(w)}
        onBadCellClicked={(p) => onBadCellClicked(p)} />
      <div className="flex flex-col content-center justify-space-around" style={{ width: '100vw', height: '100vh' }}>
        {winner ? (<span>Winner: {winner ? winner.icon : "?"}</span>) : null}
        <button type="button" onClick={() => start()}>START</button>
        <button type="button" onClick={() => quit()}>QUIT</button>
      </div>
    </div>
  )
}
