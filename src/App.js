import { useState } from "react";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);

  const getPokemon = async (nameOrId) => {
    try {
      const res = await fetch(`https://back-poke-api.vercel.app/api/pokemon/${nameOrId}`);
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
  };

  return (
    <div>
      <h1>Buscar Pokémon</h1>
      <input
        type="text"
        placeholder="No. de pokedex o nombre"
        onKeyDown={(e) => e.key === "Enter" && getPokemon(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {pokemon && (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprite} alt={pokemon.name} />
          <p>Numero de Pokedex: {pokemon.id}</p>
          <p>Altura: {pokemon.height}</p>
          <p>Debilidades: {pokemon.weaknesses.join(", ")}</p>
          <p>Resistencias: {pokemon.resistances.join(", ")}</p>
          <p>Peso: {pokemon.weight}</p>
          <p>Tipos: {pokemon.types.join(", ")}</p>
        </div>
      )}
    </div>
  );
}

export default App;
