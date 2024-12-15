import { useState, useEffect } from 'react';

interface Character {
  _id: string;
  name: string;
  imageUrl?: string;
  films?: string[];
}

const fetchAllCharacters = async (): Promise<Character[]> => {
  let allCharacters: Character[] = [];
  let currentPage = 1;
  const pageSize = 50;

  try {
    for (let i = 0; i < 3; i++) {
      const response = await fetch(`https://api.disneyapi.dev/character?page=${currentPage}&pageSize=${pageSize}`);
      
      if (!response.ok) {
        throw new Error('Virhe haettaessa hahmoja');
      }

      const data = await response.json();
      const characters: Character[] = data.data;

      allCharacters = [...allCharacters, ...characters];

      if (!data.info.nextPage) {
        break;
      }

      currentPage++;
    }
  } catch (error) {
    console.error('Virhe haettaessa hahmoja:', error);
  }

  return allCharacters;
};
  

// Funktio satunnaisten hahmojen valitsemiseksi
const getRandomCharacters = (characters: any[], count: number) => {
  const shuffled = [...characters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CharacterList = () => {
  const [randomCharacters, setRandomCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCharacters = async () => {
      const charactersData = await fetchAllCharacters();
      setRandomCharacters(getRandomCharacters(charactersData, 12)); // Näytetään 12 satunnaista hahmoa
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
          flexWrap: 'wrap',
          gap: '20px',
          justifyContent: 'center',
          maxWidth: '100%'
        }}
      >
        {randomCharacters.map((character, index) => (
          <div
            key={character._id || index}
            style={{
              flex: '1 1 200px',
              maxWidth: '200px',
              textAlign: 'center',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
