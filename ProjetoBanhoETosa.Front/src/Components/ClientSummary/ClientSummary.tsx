import styles from "./ClientSummary.module.css";

interface ClientSummaryProps {
  totalClients: number;
  totalPets: number;
  loading?: boolean;
  error?: string | null;
}

export default function ClientSummary({ totalClients, totalPets, loading, error }: ClientSummaryProps) {
  return (
    <div className={styles.Container}>
      <h3 className={styles.Title}>Clientes & Pets</h3>
      {loading ? (
        <p className={styles.Muted}>Carregando...</p>
      ) : error ? (
        <p className={styles.Error}>{error}</p>
      ) : (
        <div className={styles.Grid}>
          <div className={styles.Card}>
            <span className={styles.Label}>Clientes</span>
            <span className={styles.Value}>{totalClients}</span>
          </div>
          <div className={styles.Card}>
            <span className={styles.Label}>Pets</span>
            <span className={styles.Value}>{totalPets}</span>
          </div>
        </div>
      )}
    </div>
  );
}
