import React from 'react';
import { Link } from 'react-router-dom';

function AccomplistItem(props) {
    return (
        <div className='col-sm'>
            {props.list.map(accomplist_item => {
                return (
                    <div key={accomplist_item.id}>
                        <div className="item-card text-center">
                            <Link to={`/accomplist_items/${accomplist_item.id}`}>
                            <img src={accomplist_item.photo} className="card-img-top" alt=""></img></Link>
                            <div className="profile-content">
                                <h3 className="profile-name">{accomplist_item.title}</h3>
                            </div>
                            <div className="profile-description">{accomplist_item.details}</div>
                            <div className="row">
                                <div className="col">
                                    <div className="profile-overview">
                                        Wanted by: <h6>0</h6>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="profile-overview">
                                        Completed by: <h6>0</h6>
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

class AccomplistItemCards extends React.Component {
    state = {
        originalItems: [], // This is where you will store the initial list of items.
        itemColumns: [[], [], []],
        selectedSortOption: '',
        searchTerm: '',
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

                this.setState({ itemColumns, originalItems: data });
            }
        } catch (e) {
            console.error(e);
        }
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
        const allItems = this.state.originalItems;
        const sortedItems = allItems.sort((a, b) => {
            return selectedSortOption === 'id' ? a.id - b.id : b.id - a.id;
        });

        const itemColumns = [[], [], []];
        for (let i = 0; i < sortedItems.length; i++) {
            itemColumns[i % 3].push(sortedItems[i]);
        }

        this.setState({ selectedSortOption, itemColumns });
    };

    render() {
        const sortOptions = [
            { value: 'id', label: 'Date (newest to oldest)' },
            { value: 'id2', label: 'Date (oldest to newest)' },
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
                        <div className="col-sm-4 d-flex">
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
