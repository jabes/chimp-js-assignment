import * as React from 'react';

export namespace Header {
    export interface Props {
    }
}

export class Header extends React.Component<Header.Props> {
    render() {
        return (
            <header>
                <h1>Rolodex</h1>
            </header>
        );
    }
}