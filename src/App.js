import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(response => response.json())
      .then(data => setPokemons(data.results));
  }, []);

    const [search, setSearch] = useState('');

    const filtered = pokemons.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="App">
        <h1>Pokédex</h1>
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-bar"
        />
        <div className="card-grid">
          {filtered.map((p, index) => {
            // Extraer el ID del Pokémon desde la URL
            const idMatch = p.url.match(/\/pokemon\/(\d+)\//);
            const pokeId = idMatch ? idMatch[1] : index+1;
            return (
              <div className="poke-card" key={pokeId}>
                <div className="poke-img-wrapper">
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
                    alt={p.name}
                    className="poke-img"
                  />
                </div>
                <div className="poke-info">
                  <span className="poke-name">{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</span>
                  <span className="poke-id">#{pokeId}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default App;