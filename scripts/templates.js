

function getPokemonCardTemplate(pokemon, typesHTML, bgColor, index) {
	return /* HTML */ `
		<div
			class="pokemon-card"
			onclick="openOverlay(${index})"
			style="--bg-color: ${bgColor}"
		>
			<div class="name-id">
				<h4 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h4>
				<span class="pokemon-id">#${pokemon.id}</span>
			</div>
			<div class="types-img">
				<div class="pokemon-types">${typesHTML}</div>
				<img src="${pokemon.image}" alt="${pokemon.name}" />
			</div>
		</div>
	`;
}


function getPokemonTypesTemplate(type) {
	return /* HMTL */ `<p class="pokemon-type">${capitalizeFirstLetter(type.type.name)}</p>`;
}


function getMessageTemplate(message) {
	return /* HMTL */ `<h3>${message}<h3>`;
}


function getOverlayPokemonTemplate(pokemon, typesHTML) {
	return `
    <div class="overlay-top">
      <div class="top-header">
        <span class="name">${capitalizeFirstLetter(pokemon.name)}</span>
        <span class="id">#${pokemon.id}</span>
      </div>
      <div class="top-content">
        <div class="types">${typesHTML}</div>
        <div class="image"><img src="${pokemon.image}" alt="${pokemon.name}" /></div>
      </div>
    </div>
    <div class="overlay-menu">
      <button onclick="toggleOverlaySection('about')">About</button>
      <button onclick="toggleOverlaySection('stats')">Base Stats</button>
    </div>
    <div id="overlay-content" class="overlay-bottom">
      <!-- dynamic section -->
    </div>
    <div class="overlay-nav">
      <button onclick="changePokemon(-1)">Previous</button>
      <button onclick="changePokemon(1)">Next</button>
    </div>
  `;
}


function getOverlayAboutTemplate(pokemon, abilities) {
	return /* HMTL */ `
      <div><strong>Name:</strong> ${capitalizeFirstLetter(pokemon.name)}</div>
      <div><strong>Weight:</strong> ${pokemon.weight} kg</div>
      <div><strong>Height:</strong> ${pokemon.height} m</div>
      <div><strong>Abilities:</strong> ${abilities}</div>
    `;
}


function getOverlayStatsTemplate(stat) {
	return `<div><strong>${capitalizeFirstLetter(stat.stat.name)}:</strong> ${stat.base_stat}</div>`
}