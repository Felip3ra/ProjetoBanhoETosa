
// import CalendarView from "../../Components/Calendar";
import CalendarView from "../../Components/Calendar/CalendarView/CalendarView";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();
    const storedUser = useMemo(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/Login");
    };
    
    return(
        <div className="bg-[#f9fafb] pb-2">
            <CalendarView userName={storedUser?.name} onLogout={handleLogout}/>
        </div>
    );
}
