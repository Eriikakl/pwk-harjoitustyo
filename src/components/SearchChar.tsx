import React, { useState, useEffect } from 'react';

const fetchAllCharacters = async () => {
    let allCharacters = [];
    let currentPage = 1; // Alustetaan ensimmäinen sivu
    const pageSize = 50;
  
    try {
      // Haetaan 3 sivua kerrallaan (tai voit asettaa enemmän)
      for (let i = 0; i < 3; i++) {
        const response = await fetch(`https://api.disneyapi.dev/character?page=${currentPage}&pageSize=${pageSize}`);
        
        if (!response.ok) {
          throw new Error('Virhe haettaessa hahmoja');
        }
  
        const data = await response.json();
        const characters = data.data;
  
        allCharacters = [...allCharacters, ...characters];
  
        // Jos ei ole seuraavaa sivua, lopetetaan
        if (!data.info.nextPage) {
          break;
        }
  
        // Siirrytään seuraavalle sivulle
        currentPage++;
      }
    } catch (error) {
      console.error('Virhe haettaessa hahmoja:', error);
    }
  
    return allCharacters;
  };
  

// Funktio satunnaisten hahmojen valitsemiseksi
const getRandomCharacters = (characters: any[], count: number) => {
  // Satunnaistaa hahmojen järjestyksen ja valitsee `count` hahmoa
  const shuffled = [...characters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [randomCharacters, setRandomCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCharacters = async () => {
      const charactersData = await fetchAllCharacters();
      setCharacters(charactersData);
      setRandomCharacters(getRandomCharacters(charactersData, 10)); // Näytetään 10 satunnaista hahmoa
      setLoading(false);
    };

    getCharacters();
  }, []);

  if (loading) {
    return <p>Ladataan hahmoja...</p>;
  }

  return (
    <div>
    <h2>Disney Hahmot</h2>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap', // Tämä varmistaa, että hahmot siirtyvät seuraavalle riville tarvittaessa
        gap: '20px', // Väli hahmojen välillä
      }}
    >
      {randomCharacters.map((character, index) => (
        <div
          key={index}
          style={{
            width: '200px', // Hahmon kortin leveys
            textAlign: 'center', // Keskittää tekstin
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Varjostus
            padding: '10px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>{character.name}</h3>
          {character.imageUrl && (
            <img
              src={character.imageUrl}
              alt={character.name}
              style={{
                width: '150px',
                maxHeight: '200px',
                height: 'auto', 
                borderRadius: '10px',
                marginBottom: '10px', 
              }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
  );
};

export default CharacterList;
