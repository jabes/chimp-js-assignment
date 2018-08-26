import {combineReducers} from 'redux';
import {RootState} from './state';
import {rolodexReducer} from './rolodex';
import {routerReducer, RouterState} from 'react-router-redux';

export {RootState, RouterState};

export const rootReducer = combineReducers<RootState>({
    rolodex: rolodexReducer as any,
    router: routerReducer as any
});