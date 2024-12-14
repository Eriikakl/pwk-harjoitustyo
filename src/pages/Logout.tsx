import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import firebaseConfig from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Logout() {

    const navigate = useNavigate();
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
  
    useEffect(() => {
        const handleLogout = async () => {
          try {
            await signOut(auth);
            navigate('/login');
          } catch (error) {
            console.error('Logout failed: ', error);
          }
        };
    
        handleLogout();
    
      }, [auth, navigate]);
    
      return null;
}

export default Logout;