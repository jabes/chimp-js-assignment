import {createAction} from 'redux-actions';
import {RolodexModel} from 'app/models';

export enum RolodexActionTypes {
    ADD_POKEMON = 'ADD_POKEMON',
    EDIT_POKEMON = 'EDIT_POKEMON',
    DELETE_POKEMON = 'DELETE_POKEMON',
}

export namespace RolodexActions {
    export const addPokemon = createAction<RolodexModel['text']>(RolodexActionTypes.ADD_POKEMON);
    export const editPokemon = createAction<RolodexModel['id']>(RolodexActionTypes.EDIT_POKEMON);
    export const deletePokemon = createAction<RolodexModel['id']>(RolodexActionTypes.DELETE_POKEMON);
}

export type RolodexActions = typeof RolodexActions;
