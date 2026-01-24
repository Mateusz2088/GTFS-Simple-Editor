import React from 'react';

class Routes extends React.Component {
    state = {
        routes: this.props.inputData.routes || [],
        selectedRoute: null,
        formData: {
            route_id: '',
            agency_id: '',
            route_short_name: '',
            route_long_name: '',
            route_desc: '',
            route_type: '',
            route_url: '',
            route_color: '',
            route_text_color: '',
        },
        searchQuery: '', // Dodaj stan dla zapytania wyszukiwania
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

    handleSearchChange = (e) => {
        this.setState({ searchQuery: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const newRoute = { ...formData };

        this.setState(prevState => ({
            routes: [...prevState.routes, newRoute],
            formData: {
                route_id: '',
                agency_id: '',
                route_short_name: '',
                route_long_name: '',
                route_desc: '',
                route_type: '',
                route_url: '',
                route_color: '',
                route_text_color: '',
            }
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.routes = [...updatedGTFS.routes, newRoute];
        this.props.onChange(updatedGTFS);
    };

    handleEdit = (route) => {
        this.setState({
            selectedRoute: route,
            formData: {
                route_id: route.route_id || '',
                agency_id: route.agency_id || '',
                route_short_name: route.route_short_name || '',
                route_long_name: route.route_long_name || '',
                route_desc: route.route_desc || '',
                route_type: route.route_type || '',
                route_url: route.route_url || '',
                route_color: route.route_color || '',
                route_text_color: route.route_text_color || '',
            }
        });
    };

    handleUpdate = (e) => {
        e.preventDefault();
        const { formData } = this.state;
        const updatedRoute = { ...formData };

        const updatedRoutes = this.state.routes.map(route =>
            route.route_id === updatedRoute.route_id ? updatedRoute : route
        );

        this.setState({
            routes: updatedRoutes,
            formData: {
                route_id: '',
                agency_id: '',
                route_short_name: '',
                route_long_name: '',
                route_desc: '',
                route_type: '',
                route_url: '',
                route_color: '',
                route_text_color: '',
            },
            selectedRoute: null
        });

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.routes = updatedRoutes;
        this.props.onChange(updatedGTFS);
    };

    handleDelete = (routeId) => {
        this.setState(prevState => ({
            routes: prevState.routes.filter(route => route.route_id !== routeId)
        }));

        // Update parent state
        const updatedGTFS = { ...this.props.inputData };
        updatedGTFS.routes = updatedGTFS.routes.filter(route => route.route_id !== routeId);
        this.props.onChange(updatedGTFS);
    };

    // Funkcja do filtrowania tras na podstawie zapytania wyszukiwania
    filterRoutes = () => {
        const { routes, searchQuery } = this.state;
        if (!searchQuery) return routes;
        return routes.filter(route =>
            (route.route_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (route.route_short_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (route.route_long_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (route.route_desc || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    };


    render() {
        const { formData, selectedRoute, searchQuery } = this.state;
        const filteredRoutes = this.filterRoutes(); // Filtrowane trasy

        return (
            <div>
                <h1>Definicje tras</h1>
                <form onSubmit={selectedRoute ? this.handleUpdate : this.handleSubmit}>
                    <div>
                        <label>ID Trasy:</label>
                        <input type="text" name="route_id" value={formData.route_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>ID Agencji:</label>
                        <input type="text" name="agency_id" value={formData.agency_id} onChange={this.handleInputChange} required />
                    </div>
                    <div>
                        <label>Krótka Nazwa:</label>
                        <input type="text" name="route_short_name" value={formData.route_short_name} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Długa Nazwa:</label>
                        <input type="text" name="route_long_name" value={formData.route_long_name} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Opis:</label>
                        <input type="text" name="route_desc" value={formData.route_desc} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Typ Trasy:</label>
                        <input type="text" name="route_type" value={formData.route_type} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>URL:</label>
                        <input type="text" name="route_url" value={formData.route_url} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Kolor:</label>
                        <input type="text" name="route_color" value={formData.route_color} onChange={this.handleInputChange} />
                    </div>
                    <div>
                        <label>Kolor Tekstu:</label>
                        <input type="text" name="route_text_color" value={formData.route_text_color} onChange={this.handleInputChange} />
                    </div>
                    <button type="submit">
                        {selectedRoute ? 'Aktualizuj Trasę' : 'Dodaj Trasę'}
                    </button>
                </form>

                <div>
                    <h2>Wyszukiwanie Tras</h2>
                    <input
                        type="text"
                        placeholder="Wyszukaj trasy..."
                        value={searchQuery}
                        onChange={this.handleSearchChange}
                    />
                </div>

                <div>
                    <h2>Lista Tras</h2>
                    <ul>
                        {filteredRoutes.map(route => (
                            <li key={route.route_id}>
                                {route.route_short_name} - {route.route_long_name}
                                <button onClick={() => this.handleEdit(route)}>Edytuj</button>
                                <button onClick={() => this.handleDelete(route.route_id)}>Usuń</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Routes;
