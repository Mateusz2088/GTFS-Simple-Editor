import React from 'react';
import Button from 'react-bootstrap/Button';

export default function Dane({ inputData, onChange }) {
    if (!inputData || inputData.agency.length === 0) {
        return <b>Brak danych do wyświetlenia</b>;
    }

    const handleFeedInfoChange = (index, field, value) => {
        const updated = { ...inputData };
        updated.feed_info[index][field] = value;
        onChange(updated);
    };

    const handleAgencyChange = (index, field, value) => {
        const updated = { ...inputData };
        updated.agency[index][field] = value;
        onChange(updated);
    };

    return (
        <>
            <h2>Edycja danych dot. zarządcy</h2>
            <Button variant="primary">Zaktualizuj dane</Button>
            <ul id="feed_ul">
                {inputData.feed_info.map((feed, i) => (
                    <li key={i}>
                        Nazwa <input type="text" defaultValue={feed.feed_publisher_name}
                                     onChange={e => handleFeedInfoChange(i, 'feed_publisher_name', e.target.value)} />
                        URL <input type="url" defaultValue={feed.feed_publisher_url}
                                   onChange={e => handleFeedInfoChange(i, 'feed_publisher_url', e.target.value)} />
                        Data startowa <input type="text" defaultValue={feed.feed_start_date}
                                             onChange={e => handleFeedInfoChange(i, 'feed_start_date', e.target.value)} />
                        Data końcowa <input type="text" defaultValue={feed.feed_end_date}
                                            onChange={e => handleFeedInfoChange(i, 'feed_end_date', e.target.value)} />
                    </li>
                ))}
            </ul>

            <h2>Edycja danych dot. przewoźników</h2>
            <ul id="agency_ul">
                {inputData.agency.map((agent, i) => (
                    <li key={agent.agency_id || i}>
                        Nazwa <input type="text" defaultValue={agent.agency_name}
                                     onChange={e => handleAgencyChange(i, 'agency_name', e.target.value)} />
                        URL <input type="url" defaultValue={agent.agency_url}
                                   onChange={e => handleAgencyChange(i, 'agency_url', e.target.value)} />
                        Strefa Czasowa <input type="text" defaultValue={agent.agency_timezone}
                                              onChange={e => handleAgencyChange(i, 'agency_timezone', e.target.value)} />
                        Język <input type="text" defaultValue={agent.agency_lang}
                                     onChange={e => handleAgencyChange(i, 'agency_lang', e.target.value)} />
                        Telefon <input type="tel" defaultValue={agent.agency_phone}
                                       onChange={e => handleAgencyChange(i, 'agency_phone', e.target.value)} />
                        Mail <input type="email" defaultValue={agent.agency_email}
                                    onChange={e => handleAgencyChange(i, 'agency_email', e.target.value)} />
                    </li>
                ))}
            </ul>
        </>
    );
}
