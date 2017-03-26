import React, { Component } from 'react';
import './App.css';
import SearchField from './components/search-field'

class App extends Component {

  handleSearch = (term) => {
    console.log(term);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="container">
            <h2>What Genre is this band?</h2>
            <SearchField onSearchTermChange={this.handleSearch} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
