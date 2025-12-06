import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AuthModal from './components/AuthModal';
import UserButton from './components/UserButton';
import FavoritesBar from './components/FavoritesBar';
import './styles/App.css';

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration.scope);
        })
        .catch((error) => {
          console.error('Error al registrar Service Worker:', error);
        });
    });
  }
}

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Las notificaciones no son soportadas en este navegador");
    return;
  }

  Notification.requestPermission().then((permission) => {
    console.log("Permiso de notificación:", permission);
  });
}


const typeColors = {
  normal: { bg: '#A8A878', text: '#fff' },
  fire: { bg: '#F08030', text: '#fff' },
  water: { bg: '#6890F0', text: '#fff' },
  electric: { bg: '#F8D030', text: '#333' },
  grass: { bg: '#78C850', text: '#fff' },
  ice: { bg: '#98D8D8', text: '#333' },
  fighting: { bg: '#C03028', text: '#fff' },
  poison: { bg: '#A040A0', text: '#fff' },
  ground: { bg: '#E0C068', text: '#333' },
  flying: { bg: '#A890F0', text: '#fff' },
  psychic: { bg: '#F85888', text: '#fff' },
  bug: { bg: '#A8B820', text: '#fff' },
  rock: { bg: '#B8A038', text: '#fff' },
  ghost: { bg: '#705898', text: '#fff' },
  dragon: { bg: '#7038F8', text: '#fff' },
  dark: { bg: '#705848', text: '#fff' },
  steel: { bg: '#B8B8D0', text: '#333' },
  fairy: { bg: '#EE99AC', text: '#333' },
};

const TypeBadge = ({ type }) => {
  const colors = typeColors[type?.toLowerCase()] || { bg: '#777', text: '#fff' };
  return (
    <span
      className="type-badge"
      style={{
        background: colors.bg,
        color: colors.text,
      }}
    >
      {type}
    </span>
  );
};

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  // Escuchar cambios en autenticación
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);

    // 🔔 Mostrar notificación cuando el usuario se loguea
    if (currentUser) {
      new Notification("Login correcto", {
        body: "Bienvenido de nuevo 👋",
        icon: "/logo192.png",
      });
    }
  });

  return () => unsubscribe();
}, []);


  // Verificar si el Pokémon actual es favorito
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !pokemon) {
        setIsFavorite(false);
        setFavoriteId(null);
        return;
      }

      try {
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('pokemon.id', '==', pokemon.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsFavorite(true);
          setFavoriteId(querySnapshot.docs[0].id);
        } else {
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } catch (err) {
        console.error('Error al verificar favorito:', err);
      }
    };

    checkFavorite();
  }, [user, pokemon]);

  // Registrar Service Worker
  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission();
  }, []);

  const getPokemon = async (nameOrId) => {
    if (!nameOrId.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://back-poke-api.vercel.app/api/pokemon/${nameOrId.toLowerCase().trim()}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setPokemon(null);
      } else {
        setPokemon(data);
        setError(null);
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      setPokemon(null);
    }
    setLoading(false);
  };

  const toggleFavorite = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!pokemon) return;

    try {
      if (isFavorite && favoriteId) {
        // Eliminar de favoritos
        await deleteDoc(doc(db, 'favorites', favoriteId));
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        // Agregar a favoritos
        const docRef = await addDoc(collection(db, 'favorites'), {
          userId: user.uid,
          pokemon: {
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprite,
            types: pokemon.types,
          },
          createdAt: new Date(),
        });
        setIsFavorite(true);
        setFavoriteId(docRef.id);
      }
    } catch (err) {
      console.error('Error al gestionar favorito:', err);
      setError('Error al actualizar favoritos');
    }
  };

  const handleSelectFromFavorites = (favPokemon) => {
    setPokemon(favPokemon);
    setSearchValue(favPokemon.name);
  };

  const mainType = pokemon?.types?.[0]?.toLowerCase();
  const cardBg = mainType && typeColors[mainType]
    ? `linear-gradient(135deg, ${typeColors[mainType].bg}40 0%, #1F2937 50%)`
    : 'linear-gradient(135deg, #374151 0%, #1F2937 50%)';

  return (
    <div className={`app-container ${user ? 'with-sidebar' : ''}`}>
      {/* Barra de Favoritos (solo si está logueado) */}
      {user && <FavoritesBar user={user} onSelectPokemon={handleSelectFromFavorites} />}

      {/* Modal de Autenticación */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      <div className="content-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-top">
            <div className="header-left">
              <div className="pokeball-icon">
                <div className="pokeball-center" />
              </div>
              <div>
                <h1 className="title">PokéDex</h1>
              </div>
            </div>

            <UserButton user={user} onLoginClick={() => setShowAuthModal(true)} />
          </div>
          <p className="subtitle">
            Busca información detallada de cualquier Pokémon
          </p>
        </div>

        {/* Search */}
        <div className="search-container">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Nombre o número de Pokédex..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getPokemon(searchValue)}
            />
            <button
              className="search-button"
              onClick={() => getPokemon(searchValue)}
              disabled={loading}
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            <span className="error-emoji">😢</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Pokemon Card */}
        {pokemon && (
          <div className="pokemon-card" style={{ background: cardBg }}>
            {/* Header con imagen */}
            <div className="card-header">
              <span className="pokemon-number">
                #{String(pokemon.id).padStart(3, '0')}
              </span>

              {/* Botón de Favorito */}
              <button
                className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
                onClick={toggleFavorite}
              >
                {isFavorite ? '⭐' : '☆'}
              </button>

              <div className="sprite-container">
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="sprite-image"
                />
              </div>

              <h2 className="pokemon-name">{pokemon.name}</h2>

              <div className="types-container">
                {pokemon.types?.map((type, i) => (
                  <TypeBadge key={i} type={type} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="card-stats">
              {/* Physical Stats */}
              <div className="physical-stats">
                <div className="stat-box">
                  <div className="stat-icon">📏</div>
                  <div className="stat-label">Altura</div>
                  <div className="stat-value">
                    {(pokemon.height / 10).toFixed(1)} m
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">⚖️</div>
                  <div className="stat-label">Peso</div>
                  <div className="stat-value">
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </div>
                </div>
              </div>

              {/* Weaknesses */}
              {pokemon.weaknesses?.length > 0 && (
                <div className="weaknesses-section">
                  <h3 className="section-title weaknesses">
                    <span>⚠️</span> Debilidades
                  </h3>
                  <div className="types-container">
                    {pokemon.weaknesses.map((type, i) => (
                      <TypeBadge key={i} type={type} />
                    ))}
                  </div>
                </div>
              )}

              {/* Resistances */}
              {pokemon.resistances?.length > 0 && (
                <div className="resistances-section">
                  <h3 className="section-title resistances">
                    <span>🛡️</span> Resistencias
                  </h3>
                  <div className="types-container">
                    {pokemon.resistances.map((type, i) => (
                      <TypeBadge key={i} type={type} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!pokemon && !error && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🎮</div>
            <p>
              {user
                ? 'Ingresa un nombre o número para comenzar'
                : 'Ingresa un nombre o número para comenzar. Inicia sesión para guardar favoritos.'
              }
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">
            Datos obtenidos de PokéAPI
          </p>
        </div>
      </div>
    </div>
  );
}
