import { ChangeEvent } from "react";

interface TextInput{
    Type: string;
    PlaceHolder: string;
    Value: string;
    OnChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({Type,PlaceHolder,Value,OnChange}:TextInput){
    return(
        <div className="flex flex-col items-start gap-1 mb-3">
            <label>{Type === "text" ? "Email":"Senha"}</label>
            <input type={Type} placeholder={PlaceHolder} value={Value} onChange={OnChange} className="p-3 rounded-lg border text-left w-full" style={{borderColor: '#f4f6ff'}}/>
        </div>
    );
}