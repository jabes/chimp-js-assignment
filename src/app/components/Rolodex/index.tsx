import * as React from 'react';

export namespace Rolodex {
    export interface Props {
    }
    export interface State {
        error?: Error,
        isLoaded: boolean,
        pokedex?: Pokedex
    }
}

export class Rolodex extends React.Component<Rolodex.Props, Rolodex.State> {

    constructor(props: Rolodex.Props) {
        super(props);
        this.state = {
            error: undefined,
            isLoaded: false,
            pokedex: undefined
        };
    }

    fetchPokedex() {
        fetch('https://pokeapi.co/api/v2/pokedex/1')
            .then(
            (response: Response) => {
                response.json().then((data) => {
                    console.log(data);
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

    componentDidMount() {
        this.fetchPokedex();
    }

    render() {
        if (this.state.error) {
            return <div>Error: {this.state.error.message}</div>;
        } else if (!this.state.isLoaded) {
            return <div>Loading...</div>;
        } else if (this.state.isLoaded && this.state.pokedex) {
            return (
                <ol>{this.state.pokedex.pokemon_entries.map((object) => <li>{object.pokemon_species.name}</li>)}</ol>
            );
        } else {
            return <div>Something went wrong...</div>
        }
    }
}