import { useEffect, useState } from 'react'
import { DarkModeIcon, GridIcon, MapIcon, SearchIcon } from "../Icons";
import freeRoomsLogo from "../assets/freeRoomsLogo.png";
import freeroomsDoorClosed from "../assets/freeroomsDoorClosed.png";
import "./Navbar.css";

type ColorScheme = "light" | "dark";

export default function Navbar() {
    const [doorOpen, setDoorOpen] = useState(true);
    
    const colorScheme: ColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const [theme, setTheme] = useState(colorScheme);
    useEffect(() => {
        // ts is quite tuff
        document.head.insertAdjacentHTML("beforeend", `<style id="theme">*{--bg-color: var(--${theme == "dark" ? "black" : "white"});--text-color: var(--${theme == "dark" ? "white" : "black"});}</style>`);
        return () => {
            document.getElementById("theme")?.remove();
        }
    }, [theme]);
    
    return (
        <div className="navbar">
            <div className="logo">
                <div style={{ cursor: "pointer" }} onClick={() => setDoorOpen(door => !door)}>
                    <img src={doorOpen ? freeRoomsLogo : freeroomsDoorClosed} alt="icon" width={48} />
                </div>
                <a className="logo-link" href="/">Freerooms</a>
            </div>
            <div className="right">
                <button><SearchIcon size="24px" fill="currentColor"/></button>
                <button className="active"><GridIcon size="24px" fill="currentColor"/></button>
                <button><MapIcon size="24px" fill="currentColor"/></button>
                <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}><DarkModeIcon size="24px" fill="currentColor"/></button>
            </div>
        </div>
    )
}