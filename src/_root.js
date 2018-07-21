// React Native imports
import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';

// Redux imports
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './_rootReducer';

// Custom imports
import RootNavigator from './_rootNavigator';
import {containerStyle} from 'easyGrades/src/common/appStyles';
import AndroidBar from 'easyGrades/src/common/androidBar';

export default class App extends Component
{
	render()
	{
        const store = createStore(reducers);

		return(
            <Provider store = {store}>
                <View style = {containerStyle.default}>
                    <AndroidBar/>
                    <StatusBar
                        translucent
                        animated
                        backgroundColor = "rgba(0, 0, 0, 0.2)"
                    />
                    <RootNavigator/>
                </View>
            </Provider>
		);
	}
}

// This is to get rid of the warning caused while mounting screens with React-navigation.
// There's a possibility that this warning is a false-positive.
// Check if this is fixed in the next React Native update.
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])