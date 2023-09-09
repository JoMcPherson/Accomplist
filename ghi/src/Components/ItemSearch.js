import React, { useState, useEffect } from 'react';

const AccomplistSearch = () => {
    const [items, setItems] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                let url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;
                if (searchTitle) {
                    url += `?title=${searchTitle}`;
                }

                const response = await fetch(url);
                const data = await response.json();

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

        fetchData();
    }, [searchTitle]);

    return (
        <div style={{ paddingTop: "150px" }}>
            <input
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Search by title..."
            />
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

export default AccomplistSearch;
