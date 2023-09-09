import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Search = () => {
    const [items, setItems] = useState([]);
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('query');

    useEffect(() => {
        async function fetchData() {
            try {
                let url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;

                // Only append title to the URL if searchTitle is not empty
                if (searchTerm) {
                    url += `?title=${searchTerm}`;
                }

                const response = await fetch(url);
                const data = await response.json();

                if (data.message) {
                    console.error(data.message);
                } else {
                    setItems(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

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


// EXAMPLE SHIT

// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useParams } from 'react-router-dom';

// const GeneralSearch = () => {
//     const [results, setResults] = useState([]);
//     const [searchParams] = useSearchParams();
//     const searchTerm = searchParams.get('query');

//     // Using useParams to extract the search type from the URL
//     const { searchType } = useParams();

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 // Dynamically build the URL based on the search type
//                 let url = `${process.env.REACT_APP_API_HOST}/api/${searchType}`;
//                 if (searchTerm) {
//                     url += `?query=${searchTerm}`;
//                 }
//                 console.log("Fetching from URL:", url);

//                 const response = await fetch(url);
//                 const data = await response.json();
//                 console.log("Received data:", data);

//                 if (data.message) {
//                     console.error(data.message);
//                 } else {
//                     setResults(data);
//                 }
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         }

//         if (searchTerm) {
//             fetchData();
//         }

//     }, [searchTerm, searchType]);

//     return (
//         <div style={{ paddingTop: "150px" }}>
//             <ul>
//                 {results.map(result => (
//                     <li key={result.id}>
//                         <h3>{result.title || result.name}</h3>
//                         <p>{result.details || result.email}</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default GeneralSearch;
// <Route path="/search/:searchType" component={GeneralSearch} />
