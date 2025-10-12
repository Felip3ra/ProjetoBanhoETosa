import { Dog, User, LogOut } from "lucide-react";
export default function Header() {
    return (
        <header className="shadow">
            <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Dog className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Petshop Banho e Tosa</h1>
                </div>
                <div className="flex gap-2 items-center">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Juliana</span>
                    <button

                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sair
                </button>
                </div>
                
            </div>
        </header>
    );
}