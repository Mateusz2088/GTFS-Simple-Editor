import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Funkcja do obliczania środka mapy na podstawie przystanków
const calculateMapCenter = (stops) => {
    if (stops.length === 0) {
        return [52.2297, 21.0122]; // Domyślnie Warszawa, jeśli nie ma przystanków
    }
    const latSum = stops.reduce((sum, stop) => sum + parseFloat(stop.stop_lat), 0);
    const lngSum = stops.reduce((sum, stop) => sum + parseFloat(stop.stop_lon), 0);
    const latAvg = latSum / stops.length;
    const lngAvg = lngSum / stops.length;
    return [latAvg, lngAvg];
};

// Functional component to handle map events
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: onMapClick
    });
    return null;
};

class Przystanki extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stops: this.props.inputData.stops || [],
            selectedStop: null,
            formData: {
                stop_id: '',
                stop_name: '',
                stop_lat: '',
                stop_lon: '',
            },
            mapCenter: calculateMapCenter(this.props.inputData.stops || []), // Ustawienie początkowego centrum mapy
        };
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                [name]: value
            }
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const newStop = {
            stop_id: formData.stop_id,
            stop_name: formData.stop_name,
            stop_lat: parseFloat(formData.stop_lat),
            stop_lon: parseFloat(formData.stop_lon),
        };

        this.setState(prevState => ({
            stops: [...prevState.stops, newStop],
            formData: {
                stop_id: '',
                stop_name: '',
                stop_lat: '',
                stop_lon: '',
            },
            mapCenter: calculateMapCenter([...prevState.stops, newStop]) // Aktualizacja centrum mapy
        }));

        // Aktualizuj dane w stanie rodzica
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.stops = [...updatedGTFS.stops, newStop];
        this.props.onChange(updatedGTFS);
    };

    handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                stop_lat: lat,
                stop_lon: lng
            },
            mapCenter: calculateMapCenter([...prevState.stops, { stop_lat: lat, stop_lon: lng }]) // Aktualizacja centrum mapy
        }));
    };

    handleEdit = (stop) => {
        this.setState({
            selectedStop: stop,
            formData: {
                stop_id: stop.stop_id,
                stop_name: stop.stop_name,
                stop_lat: stop.stop_lat,
                stop_lon: stop.stop_lon,
            }
        });
    };

    handleUpdate = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const updatedStop = {
            stop_id: formData.stop_id,
            stop_name: formData.stop_name,
            stop_lat: parseFloat(formData.stop_lat),
            stop_lon: parseFloat(formData.stop_lon),
        };

        const updatedStops = this.state.stops.map(stop =>
            stop.stop_id === updatedStop.stop_id ? updatedStop : stop
        );

        this.setState({
            stops: updatedStops,
            formData: {
                stop_id: '',
                stop_name: '',
                stop_lat: '',
                stop_lon: '',
            },
            selectedStop: null,
            mapCenter: calculateMapCenter(updatedStops) // Aktualizacja centrum mapy
        });

        // Aktualizuj dane w stanie rodzica
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.stops = updatedStops;
        this.props.onChange(updatedGTFS);
    };

    handleDelete = (stopId) => {
        this.setState(prevState => {
            const updatedStops = prevState.stops.filter(stop => stop.stop_id !== stopId);
            return {
                stops: updatedStops,
                mapCenter: calculateMapCenter(updatedStops) // Aktualizacja centrum mapy
            };
        });

        // Aktualizuj dane w stanie rodzica
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.stops = updatedGTFS.stops.filter(stop => stop.stop_id !== stopId);
        this.props.onChange(updatedGTFS);
    };

    render() {
        const { stops, formData, mapCenter, selectedStop } = this.state;

        return (
            <div>
                <h1>Przystanki</h1>
                <form onSubmit={selectedStop ? this.handleUpdate : this.handleSubmit}>
                    <div>
                        <label>ID Przystanku:</label>
                        <input
                            type="text"
                            name="stop_id"
                            value={formData.stop_id}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Nazwa Przystanku:</label>
                        <input
                            type="text"
                            name="stop_name"
                            value={formData.stop_name}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Szerokość Geograficzna:</label>
                        <input
                            type="text"
                            name="stop_lat"
                            value={formData.stop_lat}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Długość Geograficzna:</label>
                        <input
                            type="text"
                            name="stop_lon"
                            value={formData.stop_lon}
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">
                        {selectedStop ? 'Aktualizuj Przystanek' : 'Dodaj Przystanek'}
                    </button>
                </form>

                <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {stops.map(stop => (
                            <Marker
                                key={stop.stop_id}
                                position={[parseFloat(stop.stop_lat), parseFloat(stop.stop_lon)]}
                            >
                                <Popup>
                                    {stop.stop_name}
                                </Popup>
                            </Marker>
                        ))}
                        {formData.stop_lat && formData.stop_lon && (
                            <Marker position={[parseFloat(formData.stop_lat), parseFloat(formData.stop_lon)]} />
                        )}
                        <MapClickHandler onMapClick={this.handleMapClick} />
                    </MapContainer>
                </div>

                <div>
                    <h2>Lista Przystanków</h2>
                    <ul>
                        {stops.map(stop => (
                            <li key={stop.stop_id}>
                                {stop.stop_name} (Lat: {stop.stop_lat}, Lng: {stop.stop_lon})
                                <button onClick={() => this.handleEdit(stop)}>Edytuj</button>
                                <button onClick={() => this.handleDelete(stop.stop_id)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Przystanki;
