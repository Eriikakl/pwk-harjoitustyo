import { useState } from 'react';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'
import { getAuth } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';

interface Character {
  _id: string;
  name: string;
  imageUrl: string;
}

const SearchMovie = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<string[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [noResultsMessage, setNoResultsMessage] = useState<string | null>(null);

  // Hakutoiminto
  const handleSearch = async () => {
    if (!query.trim()) {
      setMovies([]);
      setNoResultsMessage(null);
      setCharacters([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.disneyapi.dev/character?name=${query}`
      );
      if (!response.ok) {
        throw new Error('Virhe haettaessa elokuvia');
      }
      const data = await response.json();

      if (Array.isArray(data.data)) {
        setCharacters(data.data);
        const films = data.data.reduce((acc: string[], character: any) => {
          if (character.films && Array.isArray(character.films)) {
            acc.push(...character.films);
          }
          return acc;
        }, []);
        setMovies(films);
      } else if (data.data && !Array.isArray(data.data)) {
        setCharacters([data.data]);

        const films = data.data.films && Array.isArray(data.data.films) ? data.data.films : [];
        setMovies(films);
      }

      if (data.data && data.data.length === 0) {
        setNoResultsMessage('Hakemallasi nimellä ei löytynyt hahmoja.');
      } else {
        setNoResultsMessage(null);
      }
    } catch (err) {
      console.error('Virhe haettaessa elokuvia:', err);
      setMovies([]);
      setNoResultsMessage('Virhe elokuvien hakemisessa.');
    }
  };

  const navigate = useNavigate();

  // Tallennetaan firebaseen
  const handleAddMovie = async (movieName: string) => {
    const user = getAuth().currentUser;

    if (!user) {
      console.error('Käyttäjä ei ole kirjautunut sisään');
      navigate('/login')
      return;
    }

    try {
      await addDoc(collection(db, 'userMovies'), {
        movieName,
        userId: user.uid,
        timestamp: new Date(),
      });
      setSuccessMessage('Elokuva lisätty onnistuneesti!');
    } catch (error) {
      console.error('Virhe elokuvan lisäämisessä:', error);
      setSuccessMessage('Virhe elokuvan lisäämisessä!');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Hae elokuvia hahmon perusteella</h2>
      <input
        type="text"
        placeholder="Kirjoita hakusana..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value.trim()) {
            setMovies([]);
            setNoResultsMessage(null);
            setCharacters([]);
          }
        }}
        style={{ padding: '10px', width: 'auto', marginRight: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px' }}>
        Hae
      </button>

      {noResultsMessage && (
        <p style={{ marginTop: '20px' }}>{noResultsMessage}</p>
      )}

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {characters.length > 0 && (
        <div>
          <h3>Hakemasi hahmot:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {characters.map((character, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <h3 style={{ fontSize: '1.2rem', color: '#333' }}>{character.name}</h3>
                {character.imageUrl && (
                  <img
                    src={character.imageUrl}
                    alt={character.name}
                    style={{
                      width: '150px',
                      height: 'auto',
                      borderRadius: '10px',
                      border: '2px solid #ddd',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                      marginBottom: '10px',
                    }}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {movies.length > 0 && (
        <div>
          <h3>Elokuvat:</h3>
          <ul style={{ listStyleType: 'none', padding: 0, marginTop: '20px' }}>
            {movies.map((movie, index) => (
              <li
                key={index}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    color: '#333',
                    fontFamily: "'Roboto', sans-serif",
                    margin: 0,
                  }}
                >
                  {movie}
                </h3>
                <button
                  onClick={() => handleAddMovie(movie)}
                  style={{ padding: '5px', marginTop: '10px' }}
                >
                  Lisää elokuva
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>


  );
};

export default SearchMovie;

