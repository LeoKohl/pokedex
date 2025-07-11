
//global variables
let pokemonArray = [];
let currentPokemon = [];
let loadedPokemonIds = new Set();
let offset = 0;
let limit = 40;
let renderedCount = 0;


//core load functions
function init() {
	loadSavedPokemons();
	if (pokemonArray.length === 0) {
		loadPokemon();
	} else {
		renderPokemons();
	}
	console.log(pokemonArray);
}


function loadMore() {
	document.getElementById("searchInput").value = "";
	if (renderedCount < pokemonArray.length) {
		renderPokemons();
	} else {
		loadPokemon();
	}
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
function renderPokemons() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	const nextPokemons = pokemonArray.slice(renderedCount, renderedCount + limit);
	for (const pokemon of nextPokemons) {
		let typesHTML = pokemon.types
			.map((type) => getPokemonTypesTemplate(type))
			.join("");
		let bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "#777";
		pokemonsContainerRef.innerHTML += getPokemonCardTemplate(pokemon, typesHTML, bgColor);
	}
	renderedCount += nextPokemons.length;
	savePokemons();
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
document.getElementById("searchInput").addEventListener("input", (event) => {
	const value = event.target.value.toLowerCase();
	let cards = document.querySelectorAll("div.pokemon-card");
	cards.forEach(card => {
		isVisible = checkVisibility(card, value);
		card.classList.toggle("dNone", !isVisible);
	});
});


function checkVisibility(card, value) {
	let nameMatch = card.querySelector('[class="pokemon-name"]').textContent.toLowerCase().includes(value);
	let idMatch = card.querySelector('[class="pokemon-id"]').textContent.toLowerCase().includes(value);
	let typeArray = Array.from(card.querySelectorAll('[class="pokemon-type"]'));
	let typeMatch = typeArray.some(type => type.textContent.toLowerCase().includes(value));
	return nameMatch || idMatch || typeMatch;
}


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