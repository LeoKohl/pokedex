
//global variables
let pokemonArray = [];
let currentPokemon = [];
let loadedPokemonIds = new Set();
let offset = 0;
let limit = 40;
let renderedCount = 0;


//core load functions
async function init() {
	toggleBtnLoading();
	loadSavedPokemons();
	if (pokemonArray.length === 0) {
		await loadPokemon();
	}
	updateAndRenderCurrentPokemon();
	toggleBtnLoading();
}


async function loadMore() {
	toggleBtnLoading();
	document.getElementById("searchInput").value = "";
	if (renderedCount >= pokemonArray.length) {
		await loadPokemon();
	}
	updateAndRenderCurrentPokemon();
	toggleBtnLoading();
}


async function loadPokemon() {
	try {
		await loadPokemonData();
		savePokemons();
	} catch (error) {
		console.error("Failed to load Pokémon:", error);
		alert("Something went wrong. Please try again later.");
	}
}


function updateAndRenderCurrentPokemon(limitOverride = limit) {
	renderedCount = Math.min(renderedCount + limitOverride, pokemonArray.length);
	currentPokemon = pokemonArray.slice(0, renderedCount);
	renderPokemonCards();
}


//fetch and process pokemon Data
async function loadPokemonData() {
	let response = await fetchData(
		`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
	);
	await buildPokemonArray(response.results);
	offset += limit;
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
	let pokemon = {
		id: responsePokemon.id,
		name: responsePokemon.name,
		types: responsePokemon.types,
		image: responsePokemon.sprites.other["official-artwork"].front_default,
		abilities: responsePokemon.abilities,
		stats: responsePokemon.stats,
		height: correctUnit(responsePokemon.height),
		weight: correctUnit(responsePokemon.weight),
	};
	return pokemon;
}


//render small pokemon cards 
function renderPokemonCards() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	pokemonsContainerRef.innerHTML = '';
	for (const pokemon of currentPokemon) {
		let typesHTML = pokemon.types
			.map((type) => getPokemonTypesTemplate(type))
			.join("");
		let bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "#777";
		pokemonsContainerRef.innerHTML += getPokemonCardTemplate(pokemon, typesHTML, bgColor);
	}
}


//localStorage management
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
	localStorage.clear();
	location.reload();
}


//search function
document.getElementById("searchInput").addEventListener("input", debounce(handleSearch, 250));


function handleSearch(event) {
	const value = event.target.value.toLowerCase();
	currentPokemon = pokemonArray.slice(0, renderedCount);
	if (value === "") {
		renderPokemonCards();
		return;
	}
	currentPokemon = currentPokemon.filter(pokemon => {
		const name = pokemon.name.toLowerCase();
		const id = String(pokemon.id);
		const types = pokemon.types.map(t => t.type.name.toLowerCase());
		return (
			name.includes(value) ||
			id.includes(value) ||
			types.some(type => type.includes(value))
		);
	});
	renderPokemonCards();
};


//overlay large pokemon card
function openOverlay() {
	document.getElementById('overlay').classList.remove('dNone');
}


function closeOverlay() {
	document.getElementById('overlay').classList.add('dNone');
}


function preventBubbling(event) {
	event.stopPropagation();
}


//utility functions
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


function correctUnit(unit) {
	return unit / 10;
}


function toggleBtnLoading() {
	const loadbtn = document.getElementById("loadMoreBtn");
	const resetbtn = document.getElementById("resetBtn");
	const loading = document.getElementById("loading");
	loadbtn.disabled = !loadbtn.disabled;
	resetbtn.disabled = !resetbtn.disabled;
	loading.classList.toggle("dNone");
}


async function fetchData(path = "") {
	let response = await fetch(path);
	return await response.json();
}

function debounce(cb, delay) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => cb(...args), delay);
	};
}