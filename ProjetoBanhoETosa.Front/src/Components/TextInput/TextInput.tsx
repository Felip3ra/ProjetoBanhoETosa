
import styles from "./TextInput.module.css";
import type { TextInput } from "../../interfaces/TextInput";


export default function TextInput({Type,PlaceHolder,Value,OnChange,Label}:TextInput){
    return(
        <div>
              <label className={styles['Label-Input']}>{Label}</label>
              <input
                type={Type}
                value={Value}
                onChange={OnChange}
                className={styles['Input-Field']}
                placeholder={PlaceHolder}
              />
            </div>
    )
}