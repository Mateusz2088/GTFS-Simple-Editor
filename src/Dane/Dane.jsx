import React from 'react';
import Button from 'react-bootstrap/Button';

function updateData() {

}

export default function Dane({inputData,onChange}) {
    const handleItemChange = (id,newVal) => {
        const newData = [...inputData];
        newData.agency[id] = newVal;
        onChange(newData);
    }
    if (window.agency!=null) {
        return (
            <>
                <h2>Edycja danych dot. zarządcy</h2>
                <Button variant="flat" type="submit">Zaktualizuj dane</Button>
                <ul id="feed_ul">
                    {window.feed_info.map((agent) => (
                        <li>
                            Nazwa <input type={"text"} defaultValue={agent.feed_publisher_name}/>
                            URL <input type={"url"} defaultValue={agent.feed_publisher_url}/>
                            Data startowa <input type={"text"} defaultValue={agent.feed_start_date}/>
                            Data końcowa <input type={"text"} defaultValue={agent.feed_end_date}/>
                        </li>))}
                </ul>
                {console.log("Załadowano dane zarządcy")}
                <h2>Edycja danych dot. przewoźników</h2>
                <ul id={"agency_ul"}>
                    {window.agency.map((agent) => (
                        <li id={agent.agency_id}>
                            Nazwa <input type={"text"}  defaultValue={agent.agency_name}/>
                            URL <input type={"url"} defaultValue={agent.agency_url}/>
                            Strefa Czasowa <input type={"text"} defaultValue={agent.agency_timezone}/>
                            Język <input type={"text"} defaultValue={agent.agency_lang}/>
                            Telefon <input type={"tel"} defaultValue={agent.agency_phone}/>
                            Mail <input type={"email"} defaultValue={agent.agency_email}/>
                        </li>))}
                </ul>
                {console.log("Załadowano dane przewoźników")}
            </>
        );
    }else{
        console.debug("Brak danych");
        return (<b>Brak danych do wyświetlenia</b>);
    }
}