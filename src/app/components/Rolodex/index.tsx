import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';
import * as theme from './autosuggest.css';

export namespace Rolodex {
    export interface Props {
    }

    export interface State {
        error?: Error,
        isLoaded: boolean,
        pokedex?: Pokedex,
        searchValue: string,
        suggestions: Suggestion[],
        team: PokedexPokemonEntry[]
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
                    this.state.team.push(object);
                }
            });
        }
    };

    fetchPokedex(): void {
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
    }

    getTeamList(): JSX.Element[] {
        return this.state.team.map((object: PokedexPokemonEntry) => {
            return <li>{object.pokemon_species.name}</li>;
        });
    }

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
                    <div>
                        <ol>{this.getTeamList()}</ol>
                    </div>
                </div>
            );
        } else {
            return <div>Something went wrong...</div>
        }
    }
}
