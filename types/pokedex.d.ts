interface PokedexDescription {
    description: string,
    language: ApiObject
}

interface PokedexPokemonEntry {
    entry_number: number,
    pokemon_species: ApiObject
}

interface PokedexName {
    name: string,
    language: ApiObject
}

interface Pokedex {
    name: string,
    region: string,
    is_main_series: boolean,
    descriptions: PokedexDescription[],
    pokemon_entries: PokedexPokemonEntry[],
    id: number,
    names: PokedexName[]
}