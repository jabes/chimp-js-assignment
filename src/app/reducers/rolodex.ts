import {handleActions} from 'redux-actions';
import {RootState} from './state';
import {RolodexActionTypes} from 'app/actions/rolodex';
import {RolodexModel} from 'app/models';

const initialState: RootState.RolodexState = [
    {
        id: 1,
        text: '???',
    }
];

export const rolodexReducer = handleActions<RootState.RolodexState, RolodexModel>(
    {
        [RolodexActionTypes.ADD_POKEMON]: (state, action) => {
            if (action.payload && action.payload.text) {
                return [
                    {
                        id: state.reduce((max, rolodex) => Math.max(rolodex.id || 1, max), 0) + 1,
                        completed: false,
                        text: action.payload.text
                    },
                    ...state
                ];
            } else {
                return state;
            }
        },
        [RolodexActionTypes.DELETE_POKEMON]: (state, action) => {
            return state.filter((rolodex) => rolodex.id !== (action.payload as any));
        },
        [RolodexActionTypes.EDIT_POKEMON]: (state, action) => {
            return state.map((rolodex) => {
                if (!rolodex || !action || !action.payload) {
                    return rolodex;
                } else {
                    return (rolodex.id || 0) === action.payload.id
                        ? {...rolodex, text: action.payload.text}
                        : rolodex;
                }
            });
        },
    },
    initialState
);