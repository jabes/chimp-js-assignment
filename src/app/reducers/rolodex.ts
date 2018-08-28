import {handleActions} from 'redux-actions';
import {RootState} from './state';
import {RolodexActionTypes} from 'app/actions/rolodex';
import {RolodexModel} from 'app/models';

const initialState: RootState.RolodexState = [];

export const rolodexReducer = handleActions<RootState.RolodexState, RolodexModel>(
    {
        [RolodexActionTypes.ADD_POKEMON]: (state) => {
            return state;
        },
        [RolodexActionTypes.DELETE_POKEMON]: (state) => {
            return state;
        },
        [RolodexActionTypes.EDIT_POKEMON]: (state) => {
            return state;
        },
    },
    initialState
);