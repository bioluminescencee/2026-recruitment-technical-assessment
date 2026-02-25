type Size = "small" | "big";
export function Available({ rooms, size }: {rooms: number, size: Size}) {
    // Note: total number of rooms is not provided in data, so the small version will only say available/available
    return <div className={size === "big" ? "available-container available-big" : "available-container available-small"}>
        <div className="available">
            <div className="dot" style={{backgroundColor: `var(${rooms < 1 ? "--red" : rooms < 5 ? "--accent" : "--green"})`}}></div>
            {
                size === "big" ? (rooms + " room" + (rooms === 1 ? "" : "s") + " available") :
                rooms + "/" + rooms
            }
        </div>
    </div>
}