'use client'

import { useRef, useState } from 'react';
import { Mark, Value } from './logic/values';
import React from 'react';
import Board, { BoardRef } from './components/board';
import Layout from './layout';
import variables from '../styles/variables.module.scss';

export default function Home() {

  const [winner, setWinner] = useState<Value>(undefined);
  const [playing, setPlaying] = useState<boolean>(false);

  const boardRef = useRef<BoardRef>(null);

  function handleBadClick(p: Mark) {
    alert(`Bad ${p}`);
  }

  function start(): void {
    if (boardRef.current) {
      boardRef.current.start();
      setPlaying(true);
      setWinner(undefined);
    }
    else alert("bad board-ref");
  }

  function quit(): void {
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
        onBadCellClicked={(p) => handleBadClick(p)} />
      <div className="flex flex-col">
        <div className="flex flex-row content-center justify-space-around">
          {winner ? (<span>Winner: {winner ? winner.color : "?"}</span>) : null}
        </div>
        <div className="flex flex-row content-center justify-space-around">
          <button type="button" onClick={() => start()}>START</button>
          {!winner ? (<button type="button" onClick={() => quit()}>QUIT</button>) : null}
        </div>

      </div>
    </div>
  )
}
