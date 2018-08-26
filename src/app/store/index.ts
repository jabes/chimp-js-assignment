import {Store, createStore} from 'redux';
import {History} from 'history';
import {RootState, rootReducer} from 'app/reducers';

export function configureStore(history: History, initialState?: RootState): Store<RootState> {

    const store = createStore(
        rootReducer as any, initialState as any
    ) as Store<RootState>;

    if (module.hot) {
        module.hot.accept('app/reducers', () => {
            const nextReducer = require('app/reducers');
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}