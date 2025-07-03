
const TYPE_COLORS = {
	normal: "#A8A77A",
	fire: "#EE8130",
	water: "#6390F0",
	electric: "#F7D02C",
	grass: "#7AC74C",
	ice: "#96D9D6",
	fighting: "#C22E28",
	poison: "#A33EA1",
	ground: "#E2BF65",
	flying: "#A98FF3",
	psychic: "#F95587",
	bug: "#A6B91A",
	rock: "#B6A136",
	ghost: "#735797",
	dragon: "#6F35FC",
	dark: "#705746",
	steel: "#B7B7CE",
	fairy: "#D685AD",
};

let pokemonArray = [];

async function init() {
	let response = await loadData(
		"https://pokeapi.co/api/v2/pokemon?limit=10&offset=0"
	);
	await buildPokemonArray(response.results);
	renderPokemons();
	console.log(pokemonArray);
}

async function loadData(path = "") {
	let response = await fetch(path);
	return await response.json();
}

async function buildPokemonArray(pokemonNameArray) {
	for (const pokemon of pokemonNameArray) {
		let response = await loadData(pokemon.url);
		pokemonArray.push(response);
	}
}

function renderPokemons() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	pokemonsContainerRef.innerHTML = ""; // Clear previous content

	for (const pokemon of pokemonArray) {
		let typesHTML = pokemon.types
			.map(
				(t) => getPokemonTypesTemplate(t)
			)
			.join("");
		let mainType = pokemon.types[0].type.name;
		let bgColor = TYPE_COLORS[mainType] || "#777";
		pokemonsContainerRef.innerHTML += getPokemonCardTemplate(pokemon, typesHTML, bgColor);
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
