import React, { Component } from 'react';
import './App.css';
import SearchField from './components/search-field'
import 'whatwg-fetch';
import _ from 'lodash';

const SPOTIFY_URL = "https://api.spotify.com";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.state = {
      genres: [],
      term: ""
    }
  }

  getSearchArtistUrl(artist) {
    return `${SPOTIFY_URL}/v1/search?q=${artist}&type=artist`;
  }

  searchArtist(artist) {
    return fetch(this.getSearchArtistUrl(artist), {
      method: 'GET'
    });
  }

  getArtist(data) {
    if (data.artists.items !== undefined)
      return data.artists.items[0];
  }

  getGenres(artist) {
    return artist.genres;
  }

  clearState() {
    this.setState({
      term: "",
      artist: "",
      genres: []
    })
  }

  handleSearch = (term) => {
    if (term === "") {
      this.clearState();
      return
    }
    this.setState({term: term});
    this.searchArtist(term)
    .then(response => {
      return response.text();
    })
    .then(body => {
      const data = JSON.parse(body);
      const artist = this.getArtist(data)
      if (artist !== undefined) {
        this.setState({
          artist: artist.name,
          genres: this.getGenres(artist)
        })
        window.ga('send', 'event', 'Videos', 'play', artist.name);
      }
    })
  }

  render() {
    const genreItems = this.state.genres.map((genre) => {
        const link = `https://en.wikipedia.org/wiki/${genre}`;
        return <div className="genre"><a href={link}>{genre}</a></div>
      });

    const handleSearch = _.debounce((term) => { this.handleSearch(term) }, 300);

    return (
      <div className="App">
        <div className="App-header">
          <div className="container">
            <h2>What Genre is this band?</h2>
            <SearchField onSearchTermChange={handleSearch} />
            <p>Made by <a href="http://www.futuredoug.com">Future Doug</a></p>
          </div>
        </div>
        <div className="container">
          {this.state.term === "" &&
            <p style={{color:"#AAA"}}>Enter an artist name above to see what genre their music belongs to (try <a>The xx</a>, <a>T-Pain</a> or <a>Nine Inch Nails</a>)</p>
          }
          <h1>{this.state.artist}</h1>
          <div>
            {this.state.artist && genreItems.length === 0 &&
              <p style={{color:"#AAA"}}> Hmm, There are no genres for this artist ¯\_(ツ)_/¯</p>
            }
            {genreItems}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
