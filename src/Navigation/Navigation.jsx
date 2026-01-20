import React from "react";
import {Link} from "react-router-dom";

export default function Navigation() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/wczytaj">Wczytaj GTFS.zip</Link></li>
                <li className="nav-item">
                    <Link to="/dane">Edytuj dane zarządcy i przewoźników</Link></li>
                <li className="nav-item">
                    <Link to="/kursy">Edytuj kursy</Link></li>
                <li className="nav-item">
                    <Link to="/przystanki">Edytuj przystanki</Link></li>
                <li className="nav-item">
                    <Link to="/rozklad">Edytuj rozkład</Link></li>
                <li className="nav-item">
                    <Link to="/generuj">Generuj tabliczki</Link></li>
            </ul>
        </nav>
    );
}