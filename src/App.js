import { useState } from "react";

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
    <span style={{
      background: colors.bg,
      color: colors.text,
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'capitalize',
      marginRight: '6px',
      marginBottom: '6px',
      display: 'inline-block',
    }}>
      {type}
    </span>
  );
};

// const StatItem = ({ label, value, icon }) => (
//   <div style={{
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     padding: '10px 0',
//     borderBottom: '1px solid rgba(255,255,255,0.08)',
//   }}>
//     <span style={{ fontSize: '18px' }}>{icon}</span>
//     <span style={{ color: '#9CA3AF', fontSize: '14px', minWidth: '100px' }}>{label}</span>
//     <span style={{ color: '#F3F4F6', fontWeight: '500' }}>{value}</span>
//   </div>
// );

export default function App() {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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

  const mainType = pokemon?.types?.[0]?.toLowerCase();
  const cardBg = mainType && typeColors[mainType] 
    ? `linear-gradient(135deg, ${typeColors[mainType].bg}40 0%, #1F2937 50%)`
    : 'linear-gradient(135deg, #374151 0%, #1F2937 50%)';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #111827 0%, #0F172A 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #EF4444 50%, #fff 50%)',
              border: '3px solid #374151',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                background: '#fff',
                borderRadius: '50%',
                border: '3px solid #374151',
              }}/>
            </div>
            <h1 style={{
              color: '#F9FAFB',
              fontSize: '28px',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              PokéDex
            </h1>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
            Busca información detallada de cualquier Pokémon
          </p>
        </div>

        {/* Search */}
        <div style={{
          background: '#1F2937',
          borderRadius: '16px',
          padding: '4px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ padding: '0 16px', color: '#6B7280', fontSize: '20px' }}>🔍</span>
            <input
              type="text"
              placeholder="Nombre o número de Pokédex..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && getPokemon(searchValue)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '16px 0',
                fontSize: '16px',
                color: '#F9FAFB',
              }}
            />
            <button
              onClick={() => getPokemon(searchValue)}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                color: '#fff',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginRight: '4px',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? '...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>😢</span>
            <p style={{ color: '#FCA5A5', margin: 0, fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {/* Pokemon Card */}
        {pokemon && (
          <div style={{
            background: cardBg,
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.3s ease',
          }}>
            {/* Header con imagen */}
            <div style={{
              position: 'relative',
              padding: '30px 20px 20px',
              textAlign: 'center',
            }}>
              <span style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0,0,0,0.3)',
                padding: '6px 14px',
                borderRadius: '20px',
                color: '#9CA3AF',
                fontSize: '14px',
                fontWeight: '600',
              }}>
                #{String(pokemon.id).padStart(3, '0')}
              </span>
              
              <div style={{
                width: '180px',
                height: '180px',
                margin: '0 auto 16px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
                  }}
                />
              </div>

              <h2 style={{
                color: '#F9FAFB',
                fontSize: '28px',
                fontWeight: '700',
                margin: '0 0 12px',
                textTransform: 'capitalize',
              }}>
                {pokemon.name}
              </h2>

              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
                {pokemon.types?.map((type, i) => (
                  <TypeBadge key={i} type={type} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              background: '#111827',
              borderRadius: '24px 24px 0 0',
              padding: '24px 20px',
              marginTop: '10px',
            }}>
              {/* Physical Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              }}>
                <div style={{
                  background: '#1F2937',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>📏</div>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>Altura</div>
                  <div style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '18px' }}>
                    {(pokemon.height / 10).toFixed(1)} m
                  </div>
                </div>
                <div style={{
                  background: '#1F2937',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>⚖️</div>
                  <div style={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}>Peso</div>
                  <div style={{ color: '#F9FAFB', fontWeight: '700', fontSize: '18px' }}>
                    {(pokemon.weight / 10).toFixed(1)} kg
                  </div>
                </div>
              </div>

              {/* Weaknesses */}
              {pokemon.weaknesses?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{
                    color: '#EF4444',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>⚠️</span> Debilidades
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {pokemon.weaknesses.map((type, i) => (
                      <TypeBadge key={i} type={type} />
                    ))}
                  </div>
                </div>
              )}

              {/* Resistances */}
              {pokemon.resistances?.length > 0 && (
                <div>
                  <h3 style={{
                    color: '#10B981',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>🛡️</span> Resistencias
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
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
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6B7280',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.5 }}>🎮</div>
            <p style={{ margin: 0 }}>Ingresa un nombre o número para comenzar</p>
          </div>
        )}

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          paddingBottom: '20px',
        }}>
          <p style={{ color: '#4B5563', fontSize: '12px', margin: 0 }}>
            Datos obtenidos de PokéAPI
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder {
          color: #6B7280;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}