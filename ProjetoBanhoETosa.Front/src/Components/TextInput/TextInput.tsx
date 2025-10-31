
import style from "./TextInput.module.css";
import type { TextInput } from "../../interfaces/TextInput";

export default function TextInput({Type,PlaceHolder,Value,OnChange}:TextInput){
    return(
        <div className={style['Container-Text-Input']}>
            <label>{Type === "text" ? "Email":"Senha"}</label>
            <input type={Type} placeholder={PlaceHolder} value={Value} onChange={OnChange} className={style['Text-Input-Field']}/>
        </div>
    );
}