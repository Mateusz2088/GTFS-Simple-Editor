import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Navigation from "./Navigation/Navigation.jsx";
import Wczytaj from "./Wczytaj/Wczytaj.jsx";
import Dane from "./Dane/Dane.jsx";
import Route404 from "./Route404/Route404.jsx";
import JSZip from 'jszip';
import Papa from 'papaparse';
import Przystanki from "./Dane/Przystanki.jsx";
import Shapes from "./Dane/Shapes.jsx";
import StopTimes from "./Dane/StopTimes.jsx";
import Trips from "./Dane/Trips.jsx";
import GTFS_Routes from "./Dane/GTFS_Routes.jsx";

class App extends React.Component {
    state = {
        GTFS: {
            agency: [],
            calendar_dates: [],
            feed_info: [],
            routes: [],
            shapes: [],
            stops: [],
            stop_times: [],
            trips: []
        },
        exporting: false
    };

    handleGTFSLoad = (loadedData) => {
        this.setState({ GTFS: loadedData });
    }

    handleGTFSUpdate = (updatedData) => {
        this.setState({ GTFS: updatedData });
    }

    exportGTFSZip = async () => {
        this.setState({ exporting: true });
        try {
            const zip = new JSZip();

            // Tworzymy pliki CSV z danych w stanie
            for (const [key, data] of Object.entries(this.state.GTFS)) {
                if (Array.isArray(data) && data.length > 0) {
                    const csv = Papa.unparse(data);
                    zip.file(`${key}.txt`, csv);
                }
            }

            // Generujemy ZIP jako blob i inicjujemy pobranie
            const blob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "gtfs_export.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            alert("✅ Dane GTFS zostały zapisane jako ZIP!");
        } catch (error) {
            console.error("Błąd eksportu ZIP:", error);
            alert("❌ Wystąpił błąd podczas eksportu GTFS!");
        } finally {
            this.setState({ exporting: false });
        }
    }

    render() {
        return (
            <Router>
                <div className="App">
                    <Navigation/>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '10px',
                        margin: '20px 0'
                    }}>
                        <button
                            onClick={this.exportGTFSZip}
                            disabled={this.state.exporting || Object.values(this.state.GTFS).every(arr => arr.length === 0)}
                        >
                            {this.state.exporting ? '⏳ Eksportowanie...' : '💾 Eksportuj GTFS do ZIP'}
                        </button>
                    </div>

                    <Routes>
                        <Route
                            path="/wczytaj"
                            element={<Wczytaj onDataLoaded={this.handleGTFSLoad}/>}
                        />
                        <Route
                            path="/dane"
                            element={<Dane inputData={this.state.GTFS} onChange={this.handleGTFSUpdate}/>}
                        />
                        <Route
                            path="/przystanki"
                            element={<Przystanki inputData={this.state.GTFS} onChange={this.handleGTFSUpdate}/>}
                        />
                        <Route
                            path="/trasy"
                            element={<GTFS_Routes inputData={this.state.GTFS} onChange={this.handleGTFSUpdate}/>}
                        />
                        <Route
                            path="/ksztalty"
                            element={<Shapes inputData={this.state.GTFS} onChange={this.handleGTFSUpdate}/>}
                        />
                        <Route
                            path="/czasy-postoju"
                            element={<StopTimes inputData={this.state.GTFS} onChange={this.handleGTFSUpdate}/>}
                        />
                        <Route
                            path="/kursy"
                            element={<Trips inputData={this.state.GTFS} onChange={this.handleGTFSUpdate}/>}
                        />
                        <Route path="*" element={<Route404/>}/>
                    </Routes>
                </div>
            </Router>
        );
    }
}

export default App;
