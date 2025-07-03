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
let loadedPokemonIds = new Set();
let offset = 0;
let limit = 40;

function init() {
	loadPokemon();
	console.log(pokemonArray);
	console.log(loadedPokemonIds);
}

async function loadPokemon() {
	toggleBtnLoading();
	try {
		await loadPokemonData();
		renderPokemons();
	} catch (error) {
		console.error("Failed to load Pokémon:", error);
		alert("Something went wrong. Please try again later.");
	} finally {
		toggleBtnLoading();
	}
}

async function loadPokemonData() {
	let response = await fetchData(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
	);
	await buildPokemonArray(response.results);
	offset += limit;
}

async function fetchData(path = "") {
	let response = await fetch(path);
	return await response.json();
}

async function buildPokemonArray(pokemonNameArray) {
	for (const pokemon of pokemonNameArray) {
		let response = await fetchData(pokemon.url);
		//prevent duplicates
		if (!loadedPokemonIds.has(response.id)) {
			loadedPokemonIds.add(response.id);
			pokemonArray.push(response);
		} else {
			console.log(`Skipping duplicate: ${response.name} (#${response.id})`);
		}
	}
}

function renderPokemons() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	pokemonsContainerRef.innerHTML = "";

	for (const pokemon of pokemonArray) {
		let typesHTML = pokemon.types
			.map((type) => getPokemonTypesTemplate(type))
			.join("");
		let mainType = pokemon.types[0].type.name;
		let bgColor = TYPE_COLORS[mainType] || "#777";
		pokemonsContainerRef.innerHTML += getPokemonCardTemplate(
			pokemon,
			typesHTML,
			bgColor
		);
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleBtnLoading() {
	const btn = document.getElementById("loadMoreBtn");
	const loading = document.getElementById("loading");
	btn.disabled = !btn.disabled;
	loading.classList.toggle("dNone");
}
