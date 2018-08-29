import * as React from 'react';
import * as Autosuggest from 'react-autosuggest';

export namespace Rolodex {
    export interface Props {
    }

    export interface State {
        error?: Error,
        isLoaded: boolean,
        pokedex?: Pokedex,
        searchValue: string,
        suggestions: Suggestion[]
    }
}

export class Rolodex extends React.Component<Rolodex.Props, Rolodex.State> {

    constructor(props: Rolodex.Props) {
        super(props);
        this.state = {
            isLoaded: false,
            searchValue: '',
            suggestions: []
        };
    }

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            searchValue: event.currentTarget.value
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

    renderSuggestion = (suggestion: Suggestion) => (
        <div>
            {suggestion.name}
        </div>
    );

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

    componentDidMount(): void {
        this.fetchPokedex();
    }

    render() {

        const inputProps: Autosuggest.InputProps<Suggestion> = {
            placeholder: 'Search for a pokemon...',
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
                        suggestions={this.state.suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={this.getSuggestionValue}
                        renderSuggestion={this.renderSuggestion}
                        inputProps={inputProps}
                    />
                </div>
            );
        } else {
            return <div>Something went wrong...</div>
        }
    }
}
