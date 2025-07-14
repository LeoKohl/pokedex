
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


function getOverlayPokemonTemplate(pokemon, typesHTML, bgColor) {
  return `
    <div class="pokemon-overlay-content" style="--bg-color: ${bgColor}">
      <div class="overlay-top">
        <div class="overlay-close-icon-container">
          <a onclick="closeOverlay()">
            <img class="overlay-close-icon" src="./assets/icons/close-icon.png" alt="Close" />
          </a>
        </div>
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
        <div class="overlay-menu-buttons">
          <button onclick="toggleOverlaySection('about')">About</button>
          <button onclick="toggleOverlaySection('stats')">Base Stats</button>
        </div>
      </div>
      <div class="overlay-bottom">
        <div id="overlay-bottom-content" class="overlay-bottom-content">
          <table id="overlay-bottom-content-table"></table>
        </div>
        <div class="overlay-bottom-nav">
          <a onclick="changePokemon(-1)">
            <img class="nav-icon" src="./assets/icons/left-arrow.png" alt="Previous" />
          </a>
          <a onclick="changePokemon(1)">
            <img class="nav-icon" src="./assets/icons/right-arrow.png" alt="Next" />
          </a>
        </div>
      </div>
    </div>
  `;
}


function getOverlayAboutTemplate(pokemon, abilities) {
  return /* HMTL */ `
      <tr>
        <td><strong>Species</strong></td>
        <td>${capitalizeFirstLetter(pokemon.name)}</td>
      </tr>
      <tr>
        <td><strong>Weight</strong></td>
        <td>${pokemon.weight} kg</td>
      </tr>
      <tr>
        <td><strong>Height</strong></td>
        <td>${pokemon.height} m</td>
      </tr>
      <tr>
        <td><strong>Abilities</strong></td>
        <td>${abilities}</td>
      </tr>
    `;
}


function getOverlayStatsTemplate(stats) {
  return `
    <tr>
      <td>${capitalizeFirstLetter(stats[0].stat.name)}</td>
      <td>${stats[0].base_stat}</td>
      <td>
        <progress class="stat-green" value="${stats[0].base_stat}" max="255"></progress>
      </td>
    </tr>
    <tr>
      <td>${capitalizeFirstLetter(stats[1].stat.name)}</td>
      <td>${stats[1].base_stat}</td>
      <td>
        <progress class="stat-red" value="${stats[1].base_stat}" max="180"></progress>
      </td>
    </tr>
    <tr>
      <td>${capitalizeFirstLetter(stats[2].stat.name)}</td>
      <td>${stats[2].base_stat}</td>
      <td>
        <progress class="stat-blue" value="${stats[2].base_stat}" max="230"></progress>
      </td>
    </tr>
    <tr>
      <td>${capitalizeFirstLetter(stats[3].stat.name)}</td>
      <td>${stats[3].base_stat}</td>
      <td>
        <progress class="stat-red" value="${stats[3].base_stat}" max="200"></progress>
      </td>
    </tr>
    <tr>
      <td>${capitalizeFirstLetter(stats[4].stat.name)}</td>
      <td>${stats[4].base_stat}</td>
      <td>
        <progress class="stat-blue" value="${stats[4].base_stat}" max="230"></progress>
      </td>
    </tr>
    <tr>
      <td>${capitalizeFirstLetter(stats[5].stat.name)}</td>
      <td>${stats[5].base_stat}</td>
      <td>
        <progress class="stat-green" value="${stats[5].base_stat}" max="200"></progress>
      </td>
    </tr>
    <tr>
      <td>${capitalizeFirstLetter(stats[6].stat.name)}</td>
      <td>${stats[6].base_stat}</td>
      <td>
        <progress class="stat-green" value="${stats[6].base_stat}" max="720"></progress>
      </td>
    </tr>
  `;
}