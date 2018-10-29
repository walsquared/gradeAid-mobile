// React Native imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Custom imports
import {colors} from 'gradeAid/src/common/appStyles';

export default class Divider extends Component
{
	render()
	{
		return(
			<View style = {{
				backgroundColor: colors.dividerColor,
				marginVertical: 5,
				height: 1
			}}/>
		);
	}
}