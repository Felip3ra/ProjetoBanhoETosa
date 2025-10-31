
import type { AmountMonthServicesProps } from "../../../interfaces/Appointment";
import Styles from './AmountMonthServices.module.css';

export default function AmountMothServices({MonthAppointments} : AmountMonthServicesProps){
    return(
        <div className={Styles.Container}>
              <h3 className={Styles['Container-Tittle']}>Serviços do Mês</h3>
              <div className="space-y-3">
                <div className={Styles['Info-Services-1']}>
                  <span className={Styles['Label-Info']}>Banho e Tosa</span>
                  <span className={`${Styles['Label-Value']} text-purple-600`}>
                    {MonthAppointments.filter(a => a.service === 'Banho e Tosa').length}
                  </span>
                </div>
                <div className={Styles['Info-Services-2']}>
                  <span className={Styles['Label-Info']}>Apenas Banho</span>
                  <span className={`${Styles['Label-Value']} text-blue-600`}>
                    {MonthAppointments.filter(a => a.service === 'Banho').length}
                  </span>
                </div>
                <div className={Styles['Info-Services-3']}>
                  <span className={Styles['Label-Info']}>Apenas Tosa</span>
                  <span className={`${Styles['Label-Value']} text-orange-600`}>
                    {MonthAppointments.filter(a => a.service === 'Tosa').length}
                  </span>
                </div>
              </div>
            </div>
    );
}