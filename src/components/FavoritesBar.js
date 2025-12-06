import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/FavoritesBar.css';

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

export default function FavoritesBar({ user, onSelectPokemon }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = [];
      snapshot.forEach((doc) => {
        favs.push({ id: doc.id, ...doc.data() });
      });
      setFavorites(favs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const removeFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));
    } catch (err) {
      console.error('Error al eliminar favorito:', err);
    }
  };

  const handleSelectPokemon = (pokemon) => {
    onSelectPokemon(pokemon);
    setIsMobileOpen(false); // Cerrar en móvil después de seleccionar
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Botón flotante para abrir en móvil */}
      <button 
        className="favorites-toggle-btn" 
        onClick={toggleMobileMenu}
        aria-label="Abrir favoritos"
      >
        <span>⭐</span>
        <span className="favorites-toggle-count">{favorites.length}</span>
      </button>

      {/* Overlay para cerrar en móvil - solo visible cuando está abierto */}
      {isMobileOpen && (
        <div 
          className="favorites-overlay active"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar de favoritos */}
      <div className={`favorites-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="favorites-header">
          <h3 className="favorites-title">
            <span>⭐</span>
            Mis Favoritos
          </h3>
          <p className="favorites-count">
            {favorites.length} Pokémon guardados
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="favorites-loading">
            <div className="favorites-loading-icon">⏳</div>
            <p className="favorites-loading-text">Cargando...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && favorites.length === 0 && (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">📋</div>
            <p className="favorites-empty-text">
              Aún no tienes favoritos.
              <br/>
              Busca un Pokémon y agrégalo.
            </p>
          </div>
        )}

        {/* Favorites List */}
        {!loading && favorites.length > 0 && (
          <div className="favorites-list">
            {favorites.map((fav) => {
              const mainType = fav.pokemon.types?.[0]?.toLowerCase();
              const colors = typeColors[mainType] || { bg: '#777', text: '#fff' };
              
              return (
                <div
                  key={fav.id}
                  className="favorite-item"
                  onClick={() => handleSelectPokemon(fav.pokemon)}
                  style={{
                    borderColor: '#374151',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = colors.bg;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#374151';
                  }}
                >
                  <div className="favorite-item-content">
                    <img
                      src={fav.pokemon.sprite}
                      alt={fav.pokemon.name}
                      className="favorite-sprite"
                    />
                    <div className="favorite-info">
                      <div className="favorite-name">
                        {fav.pokemon.name}
                      </div>
                      <div className="favorite-number">
                        #{String(fav.pokemon.id).padStart(3, '0')}
                      </div>
                    </div>
                    <button
                      className="favorite-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(fav.id);
                      }}
                      title="Eliminar de favoritos"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {/* Types */}
                  <div className="favorite-types">
                    {fav.pokemon.types?.map((type, i) => {
                      const typeColor = typeColors[type?.toLowerCase()] || { bg: '#777', text: '#fff' };
                      return (
                        <span
                          key={i}
                          className="favorite-type-badge"
                          style={{
                            background: typeColor.bg,
                            color: typeColor.text,
                          }}
                        >
                          {type}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}