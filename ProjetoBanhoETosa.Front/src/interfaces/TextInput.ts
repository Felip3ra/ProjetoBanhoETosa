import { ChangeEvent } from "react";

export interface TextInput{
    Type: string;
    PlaceHolder: string;
    Value: string;
    OnChange: (e: ChangeEvent<HTMLInputElement>) => void;
}