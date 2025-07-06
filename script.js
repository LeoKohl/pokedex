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
let renderedCount = 0;

function init() {
	loadSavedPokemons();
	if (pokemonArray.length === 0) {
		loadPokemon();
	} else {
		renderPokemons();
	}
	console.log(pokemonArray, loadedPokemonIds);
}

async function loadPokemon() {
	toggleBtnLoading();
	try {
		await loadPokemonData();
		renderPokemons();
		savePokemons();
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
	for (const pokemonName of pokemonNameArray) {
		let responsePokemon = await fetchData(pokemonName.url);
		//prevent duplicates
		if (!loadedPokemonIds.has(responsePokemon.id)) {
			loadedPokemonIds.add(responsePokemon.id);
			let pokemon = buildPokemonData(responsePokemon);
			pokemonArray.push(pokemon);
		} else {
			console.log(`Skipping duplicate: ${response.name} (#${response.id})`);
		}
	}
}

function buildPokemonData(responsePokemon) {
	return (pokemon = {
		id: responsePokemon.id,
		name: responsePokemon.name,
		types: responsePokemon.types,
		image: responsePokemon.sprites.other["official-artwork"].front_default,
	});
}

function loadMore() {
	if (renderedCount < pokemonArray.length) {
		renderPokemons();
	} else {
		loadPokemon();
	}
}

function renderPokemons() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	const nextPokemons = pokemonArray.slice(renderedCount, renderedCount + limit);

	for (const pokemon of nextPokemons) {
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

	renderedCount += nextPokemons.length;
	savePokemons();
}

function toggleBtnLoading() {
	const btn = document.getElementById("loadMoreBtn");
	const loading = document.getElementById("loading");
	btn.disabled = !btn.disabled;
	loading.classList.toggle("dNone");
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function savePokemons() {
	localStorage.setItem("pokemonArray", JSON.stringify(pokemonArray));
	localStorage.setItem("loadedPokemonIds", JSON.stringify([...loadedPokemonIds]));
	localStorage.setItem("offset", offset);
}

function loadSavedPokemons() {
	const savedPokemons = JSON.parse(
		localStorage.getItem("pokemonArray") || "[]"
	);
	const savedIds = JSON.parse(localStorage.getItem("loadedPokemonIds") || "[]");
	offset = parseInt(localStorage.getItem("offset") || "0", 10);

	pokemonArray = savedPokemons;
	loadedPokemonIds = new Set(savedIds);
}

function resetPokedex() {
	if (confirm("Are you sure you want to reset your Pokédex?")) {
		localStorage.clear();
		location.reload();
	}
}