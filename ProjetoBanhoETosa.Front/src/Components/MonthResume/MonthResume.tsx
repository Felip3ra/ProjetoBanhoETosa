import styles from './MonthResume.module.css';
import type { MonthResumeProps } from '../../interfaces/MonthResume';
export default function MonthResume({AmountPets,Revenue} : MonthResumeProps){
    return(
        
          <div className={styles['Container-Month-Resume']}>
            <h3 className={styles['Tittle-Month-Resume']}>Resumo do Mês</h3>
            <div className="space-y-3">
              <div className={styles['Info-Resume']}>
                <span className={styles['Label-Resume']}>Total de Pets</span>
                <span className={styles['Amount-Resume']}>
                  {AmountPets}
                </span>
              </div>
              <div className={styles['Info-Revenue']}>
                <span className={styles['Label-Revenue']}>Faturamento</span>
                <span className={styles['Amount-Revenue']}>
                  R$ {Revenue.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          
        
    );
}