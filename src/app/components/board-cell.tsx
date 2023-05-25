import { Value } from "../logic/values"
import styles from './board-cell.module.css';

interface BoardCellProps {
  value: Value,
  clicked: () => void
}

export default function BoardCell(props: BoardCellProps) {
  
  function handleClick() : void {
    props.clicked();
  }

  return (
    <div className={styles.container}>
       <span style={{width: "100%", height: "100%", backgroundColor: props.value?.color }} onClick={() => handleClick()}>
       </span>
    </div>
  )
}
