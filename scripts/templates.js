function getPokemonCardTemplate(pokemon, typesHTML, bgColor) {
	return /* HTML */ `
		<div class="pokemon-card" style="--bg-color: ${bgColor}">
			<div class="name-id">
				<h3 class="pokemon-name">${capitalizeFirstLetter(pokemon.name)}</h3>
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
