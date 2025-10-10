import TextInput from "../../Components/TextInput"
import { useState } from "react";
import { Dog } from "lucide-react";
export default function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    return (
        
            <section className="bg-[#f4f6ff] min-h-screen flex justify-center items-center">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl gap-3 shadow">
                    <div className="flex justify-center">
                        <div className="bg-blue-600 p-4 rounded-full">
                            <Dog className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl text-gray-800 mb-2">PetShop Banho e Tosa</h1>
                    <p>Sistema de Agendamentos</p>
                    <form>
                        <TextInput Type="text" PlaceHolder="seu@email.com" Value={email} OnChange={(e) => setEmail(e.target.value)}/>
                        <TextInput Type="password" PlaceHolder="********" Value={password} OnChange={(e) => setPassword(e.target.value)}/>

                        <button className="bg-blue-600 w-full p-3 rounded-lg text-white font-semibold" type="submit">Entrar</button>
                    </form>

                </div>
            </section>
        
    );
}