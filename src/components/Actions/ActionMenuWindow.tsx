import styles from "./Actions.module.scss";

export default function ActionMenuWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.ActionMenuWrap}>
      { children }
    </div>
  );
}