
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
	document.getElementById("search-input").value = "";
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
	let stats = correctAndCompleteStats(responsePokemon.stats);
	let pokemon = {
		id: responsePokemon.id,
		name: responsePokemon.name,
		types: responsePokemon.types,
		image: responsePokemon.sprites.other["official-artwork"].front_default,
		abilities: responsePokemon.abilities,
		stats: stats,
		height: correctUnit(responsePokemon.height),
		weight: correctUnit(responsePokemon.weight),
	};
	return pokemon;
}


function correctAndCompleteStats(stats) {
	let total = stats.reduce((sum, stat) => sum + stat.base_stat, 0);
	stats.push({
		base_stat: total,
		stat: { name: "total"},
	});
	stats[0].stat.name = "HP";
	stats[3].stat.name = "Sp. Atk.";
	stats[4].stat.name = "Sp. Def.";
	return stats;
}


//render small pokemon cards 
function renderPokemonCards() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	pokemonsContainerRef.innerHTML = '';
	currentPokemon.forEach((pokemon, index) => {
		const typesHTML = pokemon.types.map(type => getPokemonTypesTemplate(type)).join("");
		const bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "#777";
		pokemonsContainerRef.innerHTML += getPokemonCardTemplate(pokemon, typesHTML, bgColor, index);
	});
}


//localStorage management
function savePokemons() {
	localStorage.setItem("pokemonArray", JSON.stringify(pokemonArray));
	localStorage.setItem("loadedPokemonIds", JSON.stringify([...loadedPokemonIds]));
	localStorage.setItem("offset", offset);
}


function loadSavedPokemons() {
	const savedPokemons = JSON.parse(localStorage.getItem("pokemonArray") || "[]");
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
document.getElementById("search-input").addEventListener("input", debounce(handleSearch, 250));


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
	if (currentPokemon.length == 0) {
		searchNotFoundMessage();
	} else {
		renderPokemonCards();
	}
};


function searchNotFoundMessage() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	pokemonsContainerRef.innerHTML = '';
	let message = "Sorry. No Pokémon found!";
	pokemonsContainerRef.innerHTML = getMessageTemplate(message);
}


//overlay large pokemon card
function openOverlay(index) {
	selectedPokemonIndex = index;
	renderOverlayPokemon(currentPokemon[selectedPokemonIndex]);
	document.getElementById('overlay').classList.remove('d-none');
	document.body.classList.add('overflow-y-hidden');
}

function closeOverlay() {
	document.getElementById('overlay').classList.add('d-none');
	document.body.classList.remove('overflow-y-hidden');
}

function preventBubbling(event) {
	event.stopPropagation();
}

function showNextPokemon() {
	selectedPokemonIndex = (selectedPokemonIndex + 1) % currentPokemon.length;
	renderOverlayPokemon(currentPokemon[selectedPokemonIndex]);
}

function showPreviousPokemon() {
	selectedPokemonIndex = (selectedPokemonIndex - 1 + currentPokemon.length) % currentPokemon.length;
	renderOverlayPokemon(currentPokemon[selectedPokemonIndex]);
}

function changePokemon(indexModifier) {
	selectedPokemonIndex += indexModifier;
	if (selectedPokemonIndex < 0) {
		selectedPokemonIndex = currentPokemon.length - 1;
	}
	if (selectedPokemonIndex > currentPokemon.length - 1) {
		selectedPokemonIndex = 0;
	}
	renderOverlayPokemon(currentPokemon[selectedPokemonIndex]);
}

function renderOverlayPokemon(pokemon) {
	const typesHTML = pokemon.types.map(t => getPokemonTypesTemplate(t)).join("");
	const bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "#777";
	document.getElementById("pokemon-overlay").innerHTML = getOverlayPokemonTemplate(pokemon, typesHTML, bgColor);
	toggleOverlaySection("about");
}

function toggleOverlaySection(section) {
	let pokemon = currentPokemon[selectedPokemonIndex];
	let abilities = pokemon.abilities.map(a => capitalizeFirstLetter(a.ability.name)).join(", ");
	let overlayContentTableRef = document.getElementById("overlay-bottom-content-table");
	toggleOverlayMenuButtonActive(section);
	if (section === 'about') {
		overlayContentTableRef.innerHTML = getOverlayAboutTemplate(pokemon, abilities);
	} else if (section === 'stats') {
		let statsHTML = getOverlayStatsTemplate(pokemon.stats);
		overlayContentTableRef.innerHTML = statsHTML;
	}
}


document.addEventListener("keydown", function (event) {
	if (event.key === "Escape") {
		closeOverlay();
	}
});


document.addEventListener('keydown', (event) => {
  const overlayRef = document.getElementById('overlay');
  if (overlayRef.classList.contains('d-none')) return;

  switch (event.key) {
    case 'ArrowRight':
      changePokemon(1);
      break;
    case 'ArrowLeft':
      changePokemon(-1);
      break;
  }
});


//utility functions
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


function correctUnit(unit) {
	return unit / 10;
}


function toggleBtnLoading() {
	const loadbtn = document.getElementById("load-more-btn");
	const resetbtn = document.getElementById("reset-btn");
	const loading = document.getElementById("loading");
	loadbtn.disabled = !loadbtn.disabled;
	resetbtn.disabled = !resetbtn.disabled;
	loading.classList.toggle("d-none");
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


function toggleOverlayMenuButtonActive(section) {
	document.querySelectorAll('.overlay-menu button').forEach(btn => {
		btn.classList.toggle('active', btn.textContent.toLowerCase().includes(section));
	});

}