import React from 'react';

import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from "../../firebaseConfig";
import { getAuth } from 'firebase/auth';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface Movie {
    movieName: string;
    userId: string;
    timestamp: any;
}

function Profile() {

    const [userMovies, setUserMovies] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);


    // Haetaan käyttäjän lisäämät elokuvat
    useEffect(() => {
        const fetchUserMovies = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                console.error('Käyttäjä ei ole kirjautunut sisään');
                setLoading(false);
                return;
            }

            try {
                const moviesCollection = collection(db, 'userMovies');
                const q = query(moviesCollection, where('userId', '==', user.uid));
                const moviesSnapshot = await getDocs(q);
                const moviesList = moviesSnapshot.docs.map(doc => {
                    const data = doc.data() as Movie;
                    return {
                        id: doc.id,
                        movieName: data.movieName,
                        userId: data.userId,
                        timestamp: data.timestamp,
                    };
                });

                setUserMovies(moviesList.map(movie => movie.movieName));
                setLoading(false);
            } catch (error) {
                console.error('Virhe elokuvien hakemisessa:', error);
                setLoading(false);
            }
        };

        fetchUserMovies();
    }, []);

    // Elokuvan poiston hallinta
    const handleDeleteMovie = async (movieName: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error('Käyttäjä ei ole kirjautunut sisään');
            return;
        }

        try {
            const moviesCollection = collection(db, 'userMovies');
            const q = query(
                moviesCollection,
                where('userId', '==', user.uid),
                where('movieName', '==', movieName)
            );
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log(`Elokuva ${movieName} poistettu onnistuneesti`);
            });

            setUserMovies(prevMovies => prevMovies.filter(movie => movie !== movieName));

        } catch (error) {
            console.error('Virhe elokuvan poistamisessa:', error);
        }
    };


    if (loading) {
        return <div>Ladataan...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>Käyttäjän elokuvat</h2>

            {userMovies.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {userMovies.map((movie, index) => (
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
                            <h3>{movie}</h3>
                            <button
                                onClick={() => handleDeleteMovie(movie)}
                                style={{
                                    padding: '5px',
                                    backgroundColor: '#e74c3c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                }}
                            >
                                Poista elokuva
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Ei elokuvia lisätty.</p>
            )}
        </div>
    );
}

export default Profile;
