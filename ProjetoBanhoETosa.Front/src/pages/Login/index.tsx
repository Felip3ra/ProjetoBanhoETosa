import TextInput from "../../Components/TextInput"
import React, { useState } from "react";
import { Dog } from "lucide-react";
import { motion } from "framer-motion";
export default function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,SetLoading] = useState(false);
    function HandleSubmit(e: React.FormEvent){
        e.preventDefault();
        SetLoading(true);
        setTimeout(() => {
            SetLoading(false);
        },5000);
        console.log({email,password})
    }
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
                    <form onSubmit={HandleSubmit}>
                        <TextInput Type="text" PlaceHolder="seu@email.com" Value={email} OnChange={(e) => setEmail(e.target.value)}/>
                        <TextInput Type="password" PlaceHolder="********" Value={password} OnChange={(e) => setPassword(e.target.value)}/>

                        
                        <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={HandleSubmit}
      disabled={loading}
      className="relative flex items-center justify-center bg-blue-600 text-white font-semibold p-3 rounded-lg overflow-hidden disabled:opacity-60 w-full"
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        />
      ) : (
        "Entrar"
      )}
    </motion.button>
                    </form>

                </div>
            </section>
        
    );
}