import './App.css'
import { Card } from './card/Card'
import Navbar from './navbar/Navbar'
import { SearchBar } from './searchbar/SearchBar'

import data from "../data.json";

interface Room {
  name: string,
  rooms_available: number,
  building_picture: string
}

function App() {
  const rooms = (data as Room[]).map(room => <Card title={room.name} available={room.rooms_available} image={new URL(room.building_picture.replace("./", "/"), import.meta.url).href} />);
  return (
    <>
      <Navbar />
      <div className="app">
        <SearchBar />
        <div className="rooms">
          {rooms}
        </div>
      </div>
    </>
  )
}

export default App
