
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


function renderPokemons() {
	const pokemonsContainerRef = document.getElementById("pokemons");
	const nextPokemons = pokemonArray.slice(renderedCount, renderedCount + limit);
	for (const pokemon of nextPokemons) {
		let typesHTML = pokemon.types
			.map((type) => getPokemonTypesTemplate(type))
			.join("");
		let mainType = pokemon.types[0].type.name;
		let bgColor = TYPE_COLORS[mainType] || "#777";
		pokemonsContainerRef.innerHTML += getPokemonCardTemplate(pokemon, typesHTML, bgColor);
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


function loadMore() {
	if (renderedCount < pokemonArray.length) {
		renderPokemons();
	} else {
		loadPokemon();
	}
	document.getElementById("searchInput").value = "";
}


function resetPokedex() {
	localStorage.clear();
	location.reload();
}


function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}


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