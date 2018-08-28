type PokemonForm = ApiObject

interface PokemonAbility {
    slot: number,
    is_hidden: boolean,
    ability: ApiObject
}

interface PokemonStat {
    stat: ApiObject,
    effort: number,
    base_stat: number
}

interface PokemonMoves {
    version_group_details: PokemonVersionGroupDetail[],
    move: ApiObject
}

interface PokemonVersionGroupDetail {
    move_learn_method: ApiObject,
    level_learned_at: number,
    version_group: ApiObject
}

interface PokemonGameIndex {
    version: ApiObject,
    game_index: number
}

interface PokemonType {
    slot: number,
    type: ApiObject
}

interface Pokemon {
    forms: PokemonForm[],
    abilities: PokemonAbility[],
    stats: PokemonStat[],
    name: string,
    weight: number,
    moves: PokemonMoves[],
    sprites: {
        back_female: string,
        back_shiny_female: string,
        back_default: string,
        front_female: string,
        front_shiny_female: string,
        back_shiny: string,
        front_default: string,
        front_shiny: string
    },
    location_area_encounters: string,
    height: number,
    is_default: boolean,
    species: ApiObject,
    id: number,
    order: number,
    game_indices: PokemonGameIndex[],
    base_experience: number,
    types: PokemonType[]
}
