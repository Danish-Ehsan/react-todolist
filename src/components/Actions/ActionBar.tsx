import DBSyncBtn from "./DBSyncBtn";
import styles from "./Actions.module.scss";

export default function ActionBar() {

  return (
    <div className={styles.ActionBar}>
      <DBSyncBtn/>
    </div>
  );
}