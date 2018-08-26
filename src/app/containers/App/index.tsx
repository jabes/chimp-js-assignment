import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {RouteComponentProps} from 'react-router';
import {RolodexActions} from 'app/actions';
import {RootState} from 'app/reducers';
import {Header, Footer} from 'app/components';

export namespace App {
    export interface Props extends RouteComponentProps<void> {
        rolodex: RootState.RolodexState;
        actions: RolodexActions;
    }
}

const mapStateToProps = (state: RootState): Pick<App.Props, 'rolodex'> => ({
    rolodex: state.rolodex
});

const mapDispatchToProps = (dispatch: Dispatch): Pick<App.Props, 'actions'> => ({
    actions: bindActionCreators(RolodexActions, dispatch)
});

@connect(
    mapStateToProps,
    mapDispatchToProps
)

export class App extends React.Component<App.Props> {

    static defaultProps: Partial<App.Props> = {};

    constructor(props: App.Props, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <div>
                <Header/>
                <Footer/>
            </div>
        );
    }
}