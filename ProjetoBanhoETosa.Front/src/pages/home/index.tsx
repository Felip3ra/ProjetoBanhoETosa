
import CalendarView from "../../Components/Calendar";
import Header from "../../Components/Header";


export default function Home(){
    
    return(
        <div className="bg-[#f9fafb] pb-2">
            <Header/>
            <CalendarView/>
            
        </div>
    );
}