import React from 'react';

class StopTimes extends React.Component {
    state = {
        stopTimes: this.props.inputData.stop_times || [],
        selectedStopTime: null,
        formData: {
            trip_id: '',
            arrival_time: '',
            departure_time: '',
            stop_id: '',
            stop_sequence: '',
            stop_headsign: '',
            pickup_type: '',
            drop_off_type: '',
            shape_dist_traveled: '',
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
        const newStopTime = { ...formData };

        this.setState(prevState => ({
            stopTimes: [...prevState.stopTimes, newStopTime],
            formData: {
                trip_id: '',
                arrival_time: '',
                departure_time: '',
                stop_id: '',
                stop_sequence: '',
                stop_headsign: '',
                pickup_type: '',
                drop_off_type: '',
                shape_dist_traveled: '',
            }
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.stop_times = [...updatedGTFS.stop_times, newStopTime];
        this.props.onChange(updatedGTFS);
    };

    handleEdit = (stopTime) => {
        this.setState({
            selectedStopTime: stopTime,
            formData: { ...stopTime }
        });
    };

    handleUpdate = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const updatedStopTime = { ...formData };

        const updatedStopTimes = this.state.stopTimes.map(stopTime =>
            stopTime.trip_id === updatedStopTime.trip_id && stopTime.stop_sequence === updatedStopTime.stop_sequence ? updatedStopTime : stopTime
        );

        this.setState({
            stopTimes: updatedStopTimes,
            formData: {
                trip_id: '',
                arrival_time: '',
                departure_time: '',
                stop_id: '',
                stop_sequence: '',
                stop_headsign: '',
                pickup_type: '',
                drop_off_type: '',
                shape_dist_traveled: '',
            },
            selectedStopTime: null
        });

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.stop_times = updatedStopTimes;
        this.props.onChange(updatedGTFS);
    };

    handleDelete = (tripId, sequence) => {
        this.setState(prevState => ({
            stopTimes: prevState.stopTimes.filter(stopTime => !(stopTime.trip_id === tripId && stopTime.stop_sequence === sequence))
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.stop_times = updatedGTFS.stop_times.filter(stopTime => !(stopTime.trip_id === tripId && stopTime.stop_sequence === sequence));
        this.props.onChange(updatedGTFS);
    };

    render() {
        const { stopTimes, formData, selectedStopTime } = this.state;

        return (
            <div>
                <h1>Czasy Postoju</h1>
                <form onSubmit={selectedStopTime ? this.handleUpdate : this.handleSubmit}>
                    <div>
                        <label>ID Kursu:</label>
                        <input type="text" name="trip_id" value={formData.trip_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Czas Przyjazdu:</label>
                        <input type="text" name="arrival_time" value={formData.arrival_time} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Czas Odjazdu:</label>
                        <input type="text" name="departure_time" value={formData.departure_time} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>ID Przystanku:</label>
                        <input type="text" name="stop_id" value={formData.stop_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Sekwencja:</label>
                        <input type="text" name="stop_sequence" value={formData.stop_sequence} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Nazwa Przystanku:</label>
                        <input type="text" name="stop_headsign" value={formData.stop_headsign} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Typ Odbioru:</label>
                        <input type="text" name="pickup_type" value={formData.pickup_type} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Typ Zrzutu:</label>
                        <input type="text" name="drop_off_type" value={formData.drop_off_type} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Przebyta Odległość:</label>
                        <input type="text" name="shape_dist_traveled" value={formData.shape_dist_traveled} onChange={this.handleInputChange} />
                    </div>
                    <button type="submit">
                        {selectedStopTime ? 'Aktualizuj Czas Postoju' : 'Dodaj Czas Postoju'}
                    </button>
                </form>

                <div>
                    <h2>Lista Czasów Postoju</h2>
                    <ul>
                        {stopTimes.map(stopTime => (
                            <li key={`${stopTime.trip_id}-${stopTime.stop_sequence}`}>
                                Trip ID: {stopTime.trip_id}, Stop ID: {stopTime.stop_id}, Sequence: {stopTime.stop_sequence}
                                <button onClick={() => this.handleEdit(stopTime)}>Edytuj</button>
                                <button onClick={() => this.handleDelete(stopTime.trip_id, stopTime.stop_sequence)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default StopTimes;
