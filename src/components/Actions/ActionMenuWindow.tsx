import styles from "./Actions.module.scss";

export default function ActionMenuWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.actionMenuWrap}>
      { children }
    </div>
  );
}