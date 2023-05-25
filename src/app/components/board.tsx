import { forwardRef, useImperativeHandle, useState } from "react";
import { Mark, Value, ValueSet } from "../logic/values";
import styles from './board.module.css';
import BoardCell from "./board-cell";

export interface BoardProps {
  onWinnerChanged: (winner: Mark) => void;
  onBadCellClicked: (player: Mark) => void;
  winner: Value;
  playing: boolean;
}

export type BoardRef = {
  quit: () => void;
  start: () => void;
};

export default forwardRef<BoardRef, BoardProps>(
  function Board(props: BoardProps, ref) {

    const [valueSet, setValueSet] = useState(ValueSet.create())
    const [currentMark, setCurrentMark] = useState(Mark.X);

    function handleClick(i: number): void {
      if (!props.playing) return;
      if (props.winner) return;

      if (!valueSet.isFree(i)) {
        props.onBadCellClicked(currentMark);
        return;
      }
      const nextValueSet = valueSet.createPlay(i, currentMark);
      const winner = nextValueSet.calculateWinner();
      setValueSet(nextValueSet);
      if (winner) props.onWinnerChanged(winner);
      else setCurrentMark(currentMark.other());
    }

    function start() {
      const initialMark = Mark.X;
      const emptyValueSet = ValueSet.create();
      setValueSet(emptyValueSet);
      setCurrentMark(initialMark);
    }

    function quit(): void {
      const winner = currentMark.other();
      props.onWinnerChanged(winner);
    }

    useImperativeHandle(ref, () => ({
      start: start,
      quit: quit
    }), [currentMark, props]);

    const cells = Array.from({ length: valueSet.length() }, (_, i) => i);
    return (
      <div className={styles.container} >
        {cells.map(i => (<BoardCell key={i} value={valueSet.get(i)} clicked={() => handleClick(i)}></BoardCell>))}
      </div >
    )

  });