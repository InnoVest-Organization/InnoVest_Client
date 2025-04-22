import React from 'react'
import '../index.css'
import AppBar from '../components/Appbar.jsx'


const Home = () => {
    return (
        <div className="absolute w-full h-full">
            <AppBar position="absolute" >
                <div>Header</div>
            </AppBar>
            <div>Home</div>
        </div>
    )
}

export default Home
