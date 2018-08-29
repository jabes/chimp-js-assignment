import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import * as theme from './autosuggest.css';
import * as style from './style.css';

export namespace Rolodex {
    export interface Props {
    }

    export interface State {
        error?: Error,
        isLoaded: boolean,
        pokedex?: Pokedex,
        searchValue: string,
        suggestions: Suggestion[],
        team: Pokemon[]
    }
}

export class Rolodex extends React.Component<Rolodex.Props, Rolodex.State> {

    constructor(props: Rolodex.Props) {
        super(props);
        this.state = {
            isLoaded: false,
            searchValue: '',
            suggestions: [],
            team: []
        };
    }

    onChange = (event: React.FormEvent<any>, params?: Autosuggest.ChangeEvent | undefined) => {
        this.setState({
            searchValue: params ? params.newValue : ''
        });
    };

    onSuggestionsFetchRequested = (request: Autosuggest.SuggestionsFetchRequestedParams): void => {
        this.setState({
            suggestions: this.getSuggestions(request.value)
        });
    };

    onSuggestionsClearRequested = (): void => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestions = (value: string): Array<Suggestion> => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        let suggestions: Array<Suggestion> = [];

        if (this.state.pokedex) {
            this.state.pokedex.pokemon_entries.forEach((object: PokedexPokemonEntry) => {
                if (object.pokemon_species.name.toLowerCase().slice(0, inputLength) === inputValue) {
                    let suggestion: Suggestion = {name: object.pokemon_species.name};
                    suggestions.push(suggestion);
                }
            });
        }

        return suggestions;
    };

    getSuggestionValue = (suggestion: Suggestion) => suggestion.name;

    renderSuggestion = (suggestion: Suggestion): JSX.Element => (
        <div onClick={this.addPokemon.bind(this, suggestion)}>
            {suggestion.name}
        </div>
    );

    addPokemon = (suggestion: Suggestion) => {
        if (this.state.pokedex) {
            this.state.pokedex.pokemon_entries.forEach((object: PokedexPokemonEntry) => {
                if (object.pokemon_species.name === suggestion.name) {
                    this.fetchPokemon(object.entry_number);
                }
            });
        }
    };

    removePokemon = (pokemon1: Pokemon) => {
        this.state.team.forEach((pokemon2: Pokemon, index: number) => {
            if (pokemon1 === pokemon2) {
                this.state.team.splice(index, 1);
                this.setState({
                    team: this.state.team,
                });
            }
        });
    };

    fetchPokedex = (): void => {
        fetch('https://pokeapi.co/api/v2/pokedex/1')
            .then(
                (response: Response) => {
                    response.json().then((data) => {
                        this.setState({
                            isLoaded: true,
                            pokedex: data
                        });
                    });
                },
                (error: Error) => {
                    this.setState({
                        isLoaded: true,
                        error: error
                    });
                }
            )
    };

    fetchPokemon = (index: number): void => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
            .then(
                (response: Response) => {
                    response.json().then((data) => {
                        this.state.team.push(data);
                        this.setState({
                            team: this.state.team
                        });
                    });
                }
            )
    };

    getStatsList = (pokemon: Pokemon): JSX.Element[] => {
        return pokemon.stats.map((stat: PokemonStat) => {
            return <li>{stat.stat.name}: <b>{stat.base_stat}</b></li>;
        });
    };

    getTeamList = (): JSX.Element[] => {
        return this.state.team.map((pokemon: Pokemon) => {
            return <li className={style.pokemonCard}>
                <button className={style.deletePokemonButton}
                        onClick={this.removePokemon.bind(this, pokemon)}>
                    &times;
                </button>
                <h3 className={style.pokemonName}>{pokemon.name}</h3>
                <img className={style.pokemonSprite}
                     src={pokemon.sprites.front_default}
                     alt={pokemon.name}/>
                <ol className={style.statsList}>
                    {this.getStatsList(pokemon)}
                </ol>
            </li>;
        });
    };

    getTeam = (): JSX.Element => {
        if (this.state.team.length > 0) {
            return (
                <div>
                    <ol className={style.teamList}>
                        {this.getTeamList()}
                    </ol>
                </div>
            );
        } else {
            return <p className="zeroStateMessage">No pokemon are on your team.</p>
        }
    };

    componentDidMount(): void {
        this.fetchPokedex();
    }

    render(): JSX.Element {

        const inputProps: Autosuggest.InputProps<Suggestion> = {
            placeholder: `Search from ${this.state.pokedex ? this.state.pokedex.pokemon_entries.length : 0} pokemon...`,
            value: this.state.searchValue,
            onChange: this.onChange
        };

        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else if (this.state.isLoaded && this.state.pokedex) {
            return (
                <div>
                    <Autosuggest
                        theme={theme}
                        suggestions={this.state.suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                    />
                    {this.getTeam()}
                </div>
            );
        } else {
            return <div>Something went wrong...</div>
        }
    }
}
