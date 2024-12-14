import React from 'react';

import SearchMovie from '../components/SearchMovies';
import SearchCharacter from '../components/SearchChar';
function Home() {
  return (
    <div>
      <SearchMovie />
      <SearchCharacter />
    </div>
  );
}

export default Home;
