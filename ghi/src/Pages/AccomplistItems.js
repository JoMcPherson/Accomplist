import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


function AccomplistItem(props) {
    const [wantedCount, setWantedCount] = useState(null);
    const [completedCount, setCompletedCount] = useState(null);

    useEffect(() => {
        const getCounts = async (isCompleted, setter) => {
            const countItems = {};
            for (const item of props.list) {
                const countUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/${item.id}/${isCompleted}`;
                try {
                    const response = await fetch(countUrl);
                    const data = await response.json();
                    countItems[item.id] = data;
                } catch (error) {
                    console.error('Failed to fetch data:', error);
                }
            }
            setter(countItems);
        };

        getCounts(false, setWantedCount);
        getCounts(true, setCompletedCount);
    }, [props.list]);


    if (wantedCount !== null && completedCount !== null) {

        return (
        <div className='col-sm'>
            {props.list.map(accomplist_item => {
               let wanted = wantedCount[accomplist_item.id]
               let completed = completedCount[accomplist_item.id]
                return (
                    <div key={accomplist_item.id}>
                        <div className="item-card text-center">
                            <Link to={`/accomplist_items/${accomplist_item.id}`}>
                            <img src={accomplist_item.photo} className="card-img-top" alt=""></img></Link>
                            <div className="profile-content">
                                <h2 className="profile-name">{accomplist_item.title}</h2>
                            </div>
                            <div className="profile-description">{accomplist_item.details}</div>
                            <div className="row">
                                <div className="col">
                                    <div className="profile-overview">
                                        Wanted by: <h6>{wanted}</h6>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="profile-overview">
                                        Completed by: <h6>{completed}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
    }
}

class AccomplistItemCards extends React.Component {
    state = {
        originalItems: [],
        itemColumns: [[], [], []],
        selectedSortOption: '',
        searchTerm: '',
        wantedCount: {},
        completedCount: {},
    };

    async componentDidMount() {
        const url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const accomplistItemIds = data.map(item => item.id);
                const requests = accomplistItemIds.map(id => fetch(`${process.env.REACT_APP_API_HOST}/api/accomplist_items/${id}`));

                const responses = await Promise.all(requests);
                const itemColumns = [[], [], []]

                let i = 0;
                for (const itemResponse of responses) {
                    if (itemResponse.ok) {
                        const details = await itemResponse.json();
                        itemColumns[i].push(details);
                        i = (i + 1) % 3;
                    } else {
                        console.error(itemResponse);
                    }
                }

                const wantedCounts = await this.fetchCountsForAllItems(false);
                const completedCounts = await this.fetchCountsForAllItems(true);

                this.setState({
                    wantedCount: wantedCounts,
                    completedCount: completedCounts,
                    itemColumns,
                    originalItems: data });
            }
        } catch (e) {
            console.error(e);
        }
    }

    fetchCountsForAllItems = async (isCompleted) => {
    const counts = {};
    for (const item of this.state.originalItems) {
        const countUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/${item.id}/${isCompleted}`;
        const response = await fetch(countUrl);
        const data = await response.json();
        counts[item.id] = data;
    }
    return counts;
}

    handleSearchChange = event => {
        const searchTerm = event.target.value;

        // Filtering the items based on search term
        const filteredItems = this.state.originalItems.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sorting the filtered items alphabetically
        const sortedItems = searchTerm ?
            filteredItems.sort((a, b) => a.title.localeCompare(b.title)) :
            filteredItems;

        // Re-arranging the sorted items into columns
        const itemColumns = [[], [], []];
        for (let i = 0; i < sortedItems.length; i++) {
            itemColumns[i % 3].push(sortedItems[i]);
        }

        this.setState({ searchTerm, itemColumns });
    };

    handleSortChange = event => {
        const selectedSortOption = event.target.value;
        const allItems = this.state.originalItems.slice();

        allItems.sort((a, b) => {
            switch (selectedSortOption) {
                case 'id':
                    return b.id - a.id;
                case 'id2':
                    return a.id - b.id;
                case 'wanted':
                    return this.state.wantedCount[b.id] - this.state.wantedCount[a.id];
                case 'completed':
                    return this.state.completedCount[b.id] - this.state.completedCount[a.id];
                default:
                    return 0;
            }
        });

        const itemColumns = [[], [], []];
        for (let i = 0; i < allItems.length; i++) {
            itemColumns[i % 3].push(allItems[i]);
        }

        this.setState({ selectedSortOption, itemColumns });
    };

    render() {
    const sortOptions = [
        { value: 'wanted', label: 'Mosted Wanted' },
        { value: 'completed', label: 'Most Completed' },
        { value: 'id', label: 'Date created (newest)' },
        { value: 'id2', label: 'Date created (oldest)' },
    ];

        return (
            <div>
                <div className="hero-image">
                <div className="hero-text">
                    <h1>Let's accomplish something.</h1>
                    <p>Don't see your item? <Link to="/accomplist_items/new">Create a new one</Link></p>
                </div>
            </div>
                <div className="container col-md">
                    <div className="row pt-4 justify-content-between">
                        <div className="col-sm-6">
                            <select
                                className="custom-dropdown"
                                value={this.state.selectedSortOption}
                                onChange={this.handleSortChange}
                            >
                                <option value="">Sort by...</option>
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-3 d-flex">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Filter..."
                                value={this.state.searchTerm}
                                onChange={this.handleSearchChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="container text-center col-md">
                    <br />
                    <div className="row">
                        {this.state.itemColumns.map((list, index) => {
                            const filteredList = list.filter(item =>
                                item.title.toLowerCase().includes(this.state.searchTerm.toLowerCase())
                            );
                            return <AccomplistItem key={index} list={filteredList} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default AccomplistItemCards;
