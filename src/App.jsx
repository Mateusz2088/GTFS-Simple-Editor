import React  from 'react'

import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navigation from "./Navigation/Navigation.jsx";
import Wczytaj from "./Wczytaj/Wczytaj.jsx";
import Dane from "./Dane/Dane.jsx";
import Route404 from "./Route404/Route404.jsx";


class App extends React.Component {
    state = {
        GTFS: {
            agency: [],
            calendar_dates:[],
            feed_info:[],
            routes:[],
            shapes:[],
            stops:[],
            stop_times:[],
            trips:[]
        }};

    handleGTFSLoad = (loadedData) => {
        this.setState({GTFS: loadedData});
    }
    handleGTFSUpdate = (data) => {
        this.setState({GTFS: data});
    }
    render() {
        return (
            <Router>
                <div>
                    <Navigation/>
                    <Routes>
                        <Route path="/wczytaj" element={<Wczytaj onDataLoaded = {this.handleGTFSLoad}/>}/>
                        <Route path="/dane" element={<Dane inputData = {this.state.GTFS} onChange={(org)=>{this.handleGTFSUpdate({...this.state.GTFS, org})}}/>}/>
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App
