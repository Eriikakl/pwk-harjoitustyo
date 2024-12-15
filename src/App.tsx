import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Footer from './components/Footer';

import './App.css'

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <Router basename="/pwk-harjoitustyo">
        <div className="app">
          <nav className="tab-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Etusivu</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>Profiili</NavLink>
            {user ? (
              // Näytetään "Kirjaudu ulos", jos käyttäjä on kirjautunut
              <NavLink to="/logout" className={({ isActive }) => isActive ? 'tab active logout' : 'tab logout'}>
                Kirjaudu ulos
              </NavLink>
            ) : (
              // Näytetään "Kirjaudu sisään", jos käyttäjä ei ole kirjautunut
              <NavLink to="/login" className={({ isActive }) => isActive ? 'tab active login' : 'tab login'}>
                Kirjaudu sisään
              </NavLink>
            )}
          </nav>

          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </div>
        </div>
      </Router>
      <div className="contentfooter"><Footer /> </div>
      
    </>
  )
}

export default App
