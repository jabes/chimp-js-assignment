import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import * as theme from './autosuggest.css';
import * as style from './style.css';

export namespace Rolodex {
    export interface Props {
    }

    export interface State {
        error?: Error,
        isPokedexLoaded: boolean,
        isFetchingPokemon: boolean,
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
            isPokedexLoaded: false,
            isFetchingPokemon: false,
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

    renderInputComponent = (inputProps: Autosuggest.InputProps<Suggestion>): JSX.Element => (
        <div>
            <input {...inputProps} disabled={this.state.team.length >= 6}/>
        </div>
    );

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
                            isPokedexLoaded: true,
                            pokedex: data
                        });
                    });
                },
                (error: Error) => {
                    this.setState({
                        isPokedexLoaded: true,
                        error: error
                    });
                }
            )
    };

    fetchPokemon = (index: number): void => {
        this.setState({
            isFetchingPokemon: true
        });

        fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)
            .then(
                (response: Response) => {
                    response.json().then((data) => {
                        this.state.team.push(data);
                        this.setState({
                            team: this.state.team,
                            isFetchingPokemon: false,
                            searchValue: ''
                        });
                    });
                }
            )
    };

    getStatsList = (pokemon: Pokemon): JSX.Element[] => {
        return pokemon.stats.map((stat: PokemonStat, index: number) => {
            return <li key={index}>{stat.stat.name}: <b>{stat.base_stat}</b></li>;
        });
    };

    getTeamList = (): JSX.Element[] => {
        let elements = this.state.team.map((pokemon: Pokemon, index: number) => (
            <li key={index} className={style.pokemonCard}>
                <h3 className={style.pokemonName}>{pokemon.name}</h3>
                <img className={style.pokemonSprite}
                     src={pokemon.sprites.front_default}
                     alt={pokemon.name}/>
                <ol className={style.statsList}>
                    {this.getStatsList(pokemon)}
                </ol>
                <button className={style.deletePokemonButton}
                        onClick={this.removePokemon.bind(this, pokemon)}>
                    &times;
                </button>
            </li>
        ));

        if (this.state.isFetchingPokemon) {
            elements.push(
                <li key="loading" className={style.pokemonCard}>
                    <div className={style.loadingMessage}>
                        Loading...
                    </div>
                </li>
            )
        }

        return elements;
    };

    getTeam = (): JSX.Element => {
        if (this.state.team.length > 0 || this.state.isFetchingPokemon) {
            return (
                <div>
                    <ol className={style.teamList}>
                        {this.getTeamList()}
                    </ol>
                </div>
            );
        } else {
            return <p className="zeroStateMessage">No pokemon added yet.</p>
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
        } else if (!this.state.isPokedexLoaded) {
            return <div>Loading...</div>;
        } else if (this.state.isPokedexLoaded && this.state.pokedex) {
            return (
                <div>
                    <Autosuggest
                        theme={theme}
                        suggestions={this.state.suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderInputComponent={this.renderInputComponent}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                    />
                    <h2>My Team</h2>
                    {this.getTeam()}
                </div>
            );
        } else {
            return <div>Something went wrong...</div>
        }
    }
}
