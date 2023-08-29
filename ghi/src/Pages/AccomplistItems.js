import React from 'react';

    function AccomplistItem(props) {
        return (
            <div className='col-sm'>
                {props.list.map(accomplist_items => {
                    // if (accomplist_items.?? === false)
                    return (
                        <div key={accomplist_items.id}>
                            <div className="item-card text-center">
                                <a href={accomplist_items.id}><img src={accomplist_items.photo} className="card-img-top" alt=""></img></a>
                                <div className="profile-content">
                                    {/* <a className="card-action" href="#"><i className="fa fa-heart"></i></a> */}
                                    <h3 className="profile-name">{accomplist_items.title}</h3>
                                </div>
                                <div className="profile-description">{accomplist_items.details}</div>
                                <div className="row">
                                    <div className="col">
                                        <div className="profile-overview">
                                        Wanted by: <h6>0</h6>
                                            {/* <h6>{something.completed}</h6> */}

                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="profile-overview">
                                        Completed by: <h6>0</h6>
                                            {/* <h6>{something.completed}</h6> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    // (old card) else return (
                        // <div key={accomplist_items.id}>
                        //     <div className="card mb-4 shadow">
                        //         <a href={accomplist_items.id}><img src={accomplist_items.photo} className="card-img-top" alt=""></img></a>
                        //         <h3 className="card-header">{accomplist_items.title}</h3>
                        //         <ul className="list-group list-group-flush">
                        //             <li className="list-group-item text-muted">{accomplist_items.details}</li>
                        //             <li className="list-group-item text-muted"># Completed? | #Wanted? </li>
                        //         </ul>
                        //     </div>
                        // </div>
                    // );
                }
                )}
            </div>
        );
    }

    class AcomplistItemCards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        itemColumns: [[], [], []],
        selectedSortOption: '',
        searchTerm: '',
        };
    }

    async componentDidMount() {
        const url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/`;

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const accomplistItemIds = data.map(item => item.id);

                const requests = [];
                for (let id of accomplistItemIds) {
                    const detailUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/${id}`;
                    requests.push(fetch(detailUrl));
            }

            const responses = await Promise.all(requests);
            const itemColumns = [[], [], []]

            let i = 0;
            for (const itemResponse of responses) {
                if (itemResponse.ok) {
                    const details = await itemResponse.json();
                    itemColumns[i].push(details)
                    i += 1;
                    if (i > 2) {
                        i = 0;
                    }
                } else {
                    console.error(itemResponse);
                }
            }

            this.setState({ itemColumns: itemColumns })
                }
            } catch (e) {
                console.error(e);
            }
        }

    handleSearchChange = event => {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    };

    handleSortChange = event => {
    const selectedSortOption = event.target.value;
    this.setState({ selectedSortOption });

    const sortedColumns = this.state.itemColumns.map(column =>
        [...column].sort((a, b) => {
        if (selectedSortOption === 'id') {
            return a.id - b.id;
        }
        if (selectedSortOption === 'id2') {
            return b.id - a.id;
        }
        // if you go do this then you can do that
        return 0
        })
    );

    this.setState({ itemColumns: sortedColumns });
    };

  render() {
    const sortOptions = [
      { value: 'id', label: 'Date (newest to oldest)' },
      { value: 'id2', label: 'Date (oldest to newest)' },
    //   { value: '#', label: 'Most Completed' },
    //   { value: '#', label: 'Most Wanted' },
    ];

    return (
        <>
        <h1 className="center mx-5 mt-4">Let's accomplish something.</h1>

        <div className="container col-sm">
            <div className="row pt-4">
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
            <div className="col-sm-4 d-flex justify-content-end">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                    value={this.state.searchTerm}
                    onChange={this.handleSearchChange}
                />
            </div>
            </div>
        </div>

        <div className="container text-center col-sm">
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
      </>
    );
  }
}

export default AcomplistItemCards;
