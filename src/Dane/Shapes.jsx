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

// Functional component to handle map events
const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: onMapClick
    });
    return null;
};

const calculateMapCenter = (shapes) => {
    if (shapes.length === 0) {
        return [52.2297, 21.0122]; // Default to Warsaw, Poland
    }
    const latSum = shapes.reduce((sum, shape) => sum + parseFloat(shape.shape_pt_lat), 0);
    const lngSum = shapes.reduce((sum, shape) => sum + parseFloat(shape.shape_pt_lon), 0);
    const latAvg = latSum / shapes.length;
    const lngAvg = lngSum / shapes.length;
    return [latAvg, lngAvg];
};

class Shapes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shapes: this.props.inputData.shapes || [],
            selectedShape: null,
            formData: {
                shape_id: '',
                shape_pt_lat: '',
                shape_pt_lon: '',
                shape_pt_sequence: '',
                shape_dist_traveled: '',
            },
            mapCenter: calculateMapCenter(this.props.inputData.shapes || []),
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
        const newShape = { ...formData };

        this.setState(prevState => ({
            shapes: [...prevState.shapes, newShape],
            formData: {
                shape_id: '',
                shape_pt_lat: '',
                shape_pt_lon: '',
                shape_pt_sequence: '',
                shape_dist_traveled: '',
            },
            mapCenter: calculateMapCenter([...prevState.shapes, newShape])
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.shapes = [...updatedGTFS.shapes, newShape];
        this.props.onChange(updatedGTFS);
    };

    handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        this.setState(prevState => ({
            formData: {
                ...prevState.formData,
                shape_pt_lat: lat,
                shape_pt_lon: lng
            },
            mapCenter: calculateMapCenter([...prevState.shapes, { shape_pt_lat: lat, shape_pt_lon: lng }])
        }));
    };

    handleEdit = (shape) => {
        this.setState({
            selectedShape: shape,
            formData: { ...shape }
        });
    };

    handleUpdate = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const updatedShape = { ...formData };

        const updatedShapes = this.state.shapes.map(shape =>
            shape.shape_id === updatedShape.shape_id && shape.shape_pt_sequence === updatedShape.shape_pt_sequence ? updatedShape : shape
        );

        this.setState({
            shapes: updatedShapes,
            formData: {
                shape_id: '',
                shape_pt_lat: '',
                shape_pt_lon: '',
                shape_pt_sequence: '',
                shape_dist_traveled: '',
            },
            selectedShape: null,
            mapCenter: calculateMapCenter(updatedShapes)
        });

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.shapes = updatedShapes;
        this.props.onChange(updatedGTFS);
    };

    handleDelete = (shapeId, sequence) => {
        this.setState(prevState => ({
            shapes: prevState.shapes.filter(shape => !(shape.shape_id === shapeId && shape.shape_pt_sequence === sequence)),
            mapCenter: calculateMapCenter(prevState.shapes.filter(shape => !(shape.shape_id === shapeId && shape.shape_pt_sequence === sequence)))
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.shapes = updatedGTFS.shapes.filter(shape => !(shape.shape_id === shapeId && shape.shape_pt_sequence === sequence));
        this.props.onChange(updatedGTFS);
    };

    render() {
        const { shapes, formData, mapCenter, selectedShape } = this.state;

        return (
            <div>
                <h1>Kształy</h1>
                <form onSubmit={selectedShape ? this.handleUpdate : this.handleSubmit}>
                    <div>
                        <label>ID Kształtu:</label>
                        <input type="text" name="shape_id" value={formData.shape_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Szerokość Geograficzna:</label>
                        <input type="text" name="shape_pt_lat" value={formData.shape_pt_lat} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Długość Geograficzna:</label>
                        <input type="text" name="shape_pt_lon" value={formData.shape_pt_lon} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Sekwencja:</label>
                        <input type="text" name="shape_pt_sequence" value={formData.shape_pt_sequence} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Przebyta Odległość:</label>
                        <input type="text" name="shape_dist_traveled" value={formData.shape_dist_traveled} onChange={this.handleInputChange} />
                    </div>
                    <button type="submit">
                        {selectedShape ? 'Aktualizuj Kształt' : 'Dodaj Kształt'}
                    </button>
                </form>

                <div style={{ height: '400px', width: '100%', marginTop: '20px' }}>
                    <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {shapes.map(shape => (
                            <Marker
                                key={`${shape.shape_id}-${shape.shape_pt_sequence}`}
                                position={[parseFloat(shape.shape_pt_lat), parseFloat(shape.shape_pt_lon)]}
                            >
                                <Popup>
                                    Shape ID: {shape.shape_id}, Sequence: {shape.shape_pt_sequence}
                                </Popup>
                            </Marker>
                        ))}
                        {formData.shape_pt_lat && formData.shape_pt_lon && (
                            <Marker position={[parseFloat(formData.shape_pt_lat), parseFloat(formData.shape_pt_lon)]} />
                        )}
                        <MapClickHandler onMapClick={this.handleMapClick} />
                    </MapContainer>
                </div>

                <div>
                    <h2>Lista Kształtów</h2>
                    <ul>
                        {shapes.map(shape => (
                            <li key={`${shape.shape_id}-${shape.shape_pt_sequence}`}>
                                Shape ID: {shape.shape_id}, Sequence: {shape.shape_pt_sequence}, Lat: {shape.shape_pt_lat}, Lng: {shape.shape_pt_lon}
                                <button onClick={() => this.handleEdit(shape)}>Edytuj</button>
                                <button onClick={() => this.handleDelete(shape.shape_id, shape.shape_pt_sequence)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Shapes;
