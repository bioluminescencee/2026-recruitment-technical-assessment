import { Available } from "./Available";
import "./Card.css";

export function Card({ title, available,  image }: { title: string, available: number, image: string }) {
    return (
        <div className="card" style={{ backgroundImage: `url("${image}")` }}>
            <div className="card-title-small">{title}</div>
            <Available rooms={available} size="small" />
            <Available rooms={available} size="big"/>
            <div className="card-title">{title}</div>
        </div>
    )
}