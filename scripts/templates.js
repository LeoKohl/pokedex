
function getPokemonCardTemplate(pokemon, typesHTML, bgColor) {
	return /* HTML */ `
		<div class="pokemon-card" style="background-color: ${bgColor}">
			<div class="name-id">
				<h3>${capitalizeFirstLetter(pokemon.name)}</h3>
				<span class="pokemon-id">#${pokemon.id}</span>
			</div>
			<div class="types-img">
				<div class="pokemon-types">${typesHTML}</div>
				<img
					src="${pokemon.sprites.other["official-artwork"].front_default}"
					alt="${pokemon.name}"
				/>
			</div>
		</div>
	`;
}

function getPokemonTypesTemplate(t) {
	return /* HMTL */ `<p class="pokemon-type">${capitalizeFirstLetter(
		t.type.name
	)}</p>`;
}
