
import type { TextInput } from "../../interfaces/TextInput";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


export default function TextInput({ Type, PlaceHolder, Value, OnChange, Label: LabelText }: TextInput) {
  return (
    <div className="space-y-2">
      <Label>{LabelText}</Label>
      <Input type={Type} value={Value} onChange={OnChange} placeholder={PlaceHolder} />
    </div>
  );
}
