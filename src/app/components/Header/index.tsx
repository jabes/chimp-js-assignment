import * as React from 'react';
import * as style from './style.css';
import * as pokeball from 'assets/images/pokeball.svg';

export namespace Header {
    export interface Props {
    }
}

export class Header extends React.Component<Header.Props> {
    render() {
        return (
            <header className={style.container}>
                <img width={100} height={100} className={style.logo} src={pokeball}/>
                <h1 className={style.title}>Pokédex</h1>
            </header>
        );
    }
}
