import {createContext, useState, useContext, useEffect} from "react"

const MovieContext = createContext()

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const [favorites, setFavorites] = useState(() => {
        const storedFavs = localStorage.getItem("favorites");
        return storedFavs ? JSON.parse(storedFavs) : [];
    });
    

    useEffect(() => {
        try {
            const storedFavs = localStorage.getItem("favorites");
            if (storedFavs) setFavorites(JSON.parse(storedFavs));
        } catch (error) {
            console.error("Error reading favorites from localStorage", error);
        }
    }, []);
    
    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error("Error saving favorites to localStorage", error);
        }
    }, [favorites]);
    

    const addToFavorites = (movie) => {
        setFavorites(prev => {
            if (prev.some(fav => fav.id === movie.id)) return prev; // Avoid duplicates
            return [...prev, movie];
        });
    };
    

    const removeFromFavorites = (movieId) => {
        setFavorites(prev => prev.filter(movie => movie.id !== movieId))
    }
    
    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}