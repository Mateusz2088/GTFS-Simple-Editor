import React from 'react';

class Trips extends React.Component {
    state = {
        trips: this.props.inputData.trips || [],
        selectedTrip: null,
        formData: {
            route_id: '',
            service_id: '',
            trip_id: '',
            trip_headsign: '',
            trip_short_name: '',
            direction_id: '',
            block_id: '',
            shape_id: '',
        },
    };

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
        const newTrip = { ...formData };

        this.setState(prevState => ({
            trips: [...prevState.trips, newTrip],
            formData: {
                route_id: '',
                service_id: '',
                trip_id: '',
                trip_headsign: '',
                trip_short_name: '',
                direction_id: '',
                block_id: '',
                shape_id: '',
            }
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.trips = [...updatedGTFS.trips, newTrip];
        this.props.onChange(updatedGTFS);
    };

    handleEdit = (trip) => {
        this.setState({
            selectedTrip: trip,
            formData: {
                route_id: trip.route_id || '',
                service_id: trip.service_id || '',
                trip_id: trip.trip_id || '',
                trip_headsign: trip.trip_headsign || '',
                trip_short_name: trip.trip_short_name || '',
                direction_id: trip.direction_id || '',
                block_id: trip.block_id || '',
                shape_id: trip.shape_id || '',
            }
        });
    };

    handleUpdate = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const updatedTrip = { ...formData };

        const updatedTrips = this.state.trips.map(trip =>
            trip.trip_id === updatedTrip.trip_id ? updatedTrip : trip
        );

        this.setState({
            trips: updatedTrips,
            formData: {
                route_id: '',
                service_id: '',
                trip_id: '',
                trip_headsign: '',
                trip_short_name: '',
                direction_id: '',
                block_id: '',
                shape_id: '',
            },
            selectedTrip: null
        });

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.trips = updatedTrips;
        this.props.onChange(updatedGTFS);
    };

    handleDelete = (tripId) => {
        this.setState(prevState => ({
            trips: prevState.trips.filter(trip => trip.trip_id !== tripId)
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.trips = updatedGTFS.trips.filter(trip => trip.trip_id !== tripId);
        this.props.onChange(updatedGTFS);
    };

    render() {
        const { trips, formData, selectedTrip } = this.state;

        return (
            <div>
                <h1>Kursy</h1>
                <form onSubmit={selectedTrip ? this.handleUpdate : this.handleSubmit}>
                    <div>
                        <label>ID Trasy:</label>
                        <input type="text" name="route_id" value={formData.route_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>ID Usługi:</label>
                        <input type="text" name="service_id" value={formData.service_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>ID Kursu:</label>
                        <input type="text" name="trip_id" value={formData.trip_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Nazwa Kursu:</label>
                        <input type="text" name="trip_headsign" value={formData.trip_headsign} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Krótka Nazwa Kursu:</label>
                        <input type="text" name="trip_short_name" value={formData.trip_short_name} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>ID Kierunku:</label>
                        <input type="text" name="direction_id" value={formData.direction_id} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>ID Bloku:</label>
                        <input type="text" name="block_id" value={formData.block_id} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>ID Kształtu:</label>
                        <input type="text" name="shape_id" value={formData.shape_id} onChange={this.handleInputChange} />
                    </div>
                    <button type="submit">
                        {selectedTrip ? 'Aktualizuj Kurs' : 'Dodaj Kurs'}
                    </button>
                </form>

                <div>
                    <h2>Lista Kursów</h2>
                    <ul>
                        {trips.map((trip, index) => (
                            <li key={`${trip.trip_id}_${trip.route_id}_${trip.service_id}_${index}`}>
                                Trip ID: {trip.trip_id}, Route ID: {trip.route_id}
                                <button onClick={() => this.handleEdit(trip)}>Edytuj</button>
                                <button onClick={() => this.handleDelete(trip.trip_id)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Trips;
