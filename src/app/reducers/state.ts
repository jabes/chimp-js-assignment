import {RolodexModel} from 'app/models';
import {RouterState} from 'react-router-redux';

export interface RootState {
    rolodex: RootState.RolodexState;
    router: RouterState;
}

export namespace RootState {
    export type RolodexState = RolodexModel[];
}
