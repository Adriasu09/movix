import { Outlet } from "react-router-dom"
import { WelcomeNavbar } from "./components/WelcomeNavbar"


export const WelcomeLayout = () => {
    return (
        <div>
            <WelcomeNavbar/>
            <div className="w-full flex-1">
                <Outlet/>
            </div>
            
        </div>
    )
}
