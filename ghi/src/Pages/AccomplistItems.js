import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createSlug } from '../utils/slugify';

function shuffleArray(array) {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

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
        {props.list.map(accomplist_item => {   // Removed shuffleArray call from here
          let wanted = accomplist_item.wantedCount;
          let completed = accomplist_item.completedCount;
          return (
            <div key={accomplist_item.id}>
              <div className="item-card text-center">
                <Link to={`/accomplist_items/${accomplist_item.slug}`}>
                  <img src={accomplist_item.photo} className="card-img-top" alt={accomplist_item.title}></img>
                </Link>
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
    itemColumns: [[], [], []],
    selectedSortOption: '',
    searchTerm: '',
    originalItems: [],
    shuffledItems: []
};

  async componentDidMount() {
      const url = `${process.env.REACT_APP_API_HOST}/api/accomplist_items`;

      try {
          const response = await fetch(url);
          if (response.ok) {
              const data = await response.json();

              const loadedItemsWithCounts = await Promise.all(data.map(async (item) => {
                  const wantedCount = await this.fetchItemCount(item.id, false);
                  const completedCount = await this.fetchItemCount(item.id, true);
                  const slug = createSlug(item.title);  // <-- Generating slug here
                  return {
                      ...item,
                      wantedCount,
                      completedCount,
                      slug  // <-- Storing slug in the state here
                  };
              }));

              const shuffledItems = shuffleArray(loadedItemsWithCounts);
              const itemColumns = this.distributeItemsToColumns(shuffledItems);

              this.setState({ itemColumns, originalItems: loadedItemsWithCounts, shuffledItems });
          }
      } catch (e) {
          console.error(e);
      }
  }

  distributeItemsToColumns = (items) => {
  const itemColumns = [[], [], []];
  items.forEach((item, i) => {
      itemColumns[i % 3].push(item);
  });
  return itemColumns;
}

  fetchItemCount = async (itemId, isCompleted) => {
      const countUrl = `${process.env.REACT_APP_API_HOST}/api/accomplist_items/${itemId}/${isCompleted}`;
      const response = await fetch(countUrl);
      const data = await response.json();
      return data;
  }

  handleSearchChange = event => {
      const searchTerm = event.target.value;
      const filteredItems = this.state.shuffledItems.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
      const sortedItems = searchTerm ? filteredItems.sort((a, b) => a.title.localeCompare(b.title)) : filteredItems;
      const itemColumns = this.distributeItemsToColumns(sortedItems);
      this.setState({ searchTerm, itemColumns });
  };

  handleSortChange = event => {
    const selectedSortOption = event.target.value;
    const allItems = [...this.state.itemColumns.flat()]; // Use the current displayed items for sorting

    allItems.sort((a, b) => {
      switch (selectedSortOption) {
        case 'id':
          return b.id - a.id;
        case 'id2':
          return a.id - b.id;
        case 'wanted':
          return b.wantedCount - a.wantedCount;
        case 'completed':
          return b.completedCount - a.completedCount;
        default:
          return 0;
      }
    });

    const itemColumns = this.distributeItemsToColumns(allItems);
    this.setState({ selectedSortOption, itemColumns });
  };

    render() {
    const sortOptions = [
        { value: 'wanted', label: 'Wanted Most' },
        { value: 'completed', label: 'Completed Most' },
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
                            return <AccomplistItem key={index} list={list} />;
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default AccomplistItemCards;
