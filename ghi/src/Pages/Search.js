import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [items, setItems] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('query');

    console.log("Search term and title:", searchTerm);

    useEffect(() => {
        async function fetchData() {
            try {
                let url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;

                // Only append title to the URL if searchTitle is not empty
                if (searchTerm) {
                    url += `?title=${searchTerm}`;
                }

                console.log("Fetching from URL:", url);

                const response = await fetch(url);
                const data = await response.json();

                console.log("Received data:", data);

                if (data.message) {
                    // Handle the message here (e.g., display an error or notification)
                    console.error(data.message);
                } else {
                    setItems(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        // If there's a searchTerm in the URL or searchTitle is not empty, fetch data.
        if (searchTerm) {
            fetchData();
        }

    }, [searchTerm]);

    return (
        <div style={{ paddingTop: "150px" }}>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <h3>{item.title}</h3>
                        <p>{item.details}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Search;
