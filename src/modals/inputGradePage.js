// React Native imports
import React, {Component} from 'react';
import {Alert, ScrollView, Text, TextInput, View} from 'react-native';

// Redux imports
import {connect} from 'react-redux';
import {createAssessment} from 'gradeAid/src/userData/actions';

// Custom imports
import {colors, containerStyle, textStyle} from 'gradeAid/src/common/appStyles';
import {ActionBar, Button, CheckList, Divider, IconButton} from 'gradeAid/src/common';
import * as Assessment from 'gradeAid/src/semesterScreen/assessmentTypes';

class InputGradePage extends Component
{
	constructor(props)
	{
		super(props);

		var checkBoxLabels = [];
		var checkBoxValues = [];
		for (type in props.courseAssessmentTypes)
		{
			checkBoxLabels.push(Assessment.types[props.courseAssessmentTypes[type]]);
			checkBoxValues.push(false);
		}

		this.state =
		{
			checkBoxLabels,
			checkBoxValues,
			currentScene: 0,
			percentage: "",
			numerator: "",
			denominator: "",
			name: "",
			useFraction: false
		}
	}

	showAlert(alertType)
	{
		switch (alertType)
		{
			case "No Type Selection Made":

				Alert.alert(
					"No Type Selection",
					"Please be sure to select at least one assessment type.",
					[{text: 'OK', onPress: () => {}}],
					{cancelable: true}
				);
				return;

			case "Name Used":

				Alert.alert(
					"Name Used",
					"You have already used this name on an assessment in this course.",
					[{text: 'OK', onPress: () => {}}],
					{cancelable: true}
				);
				return;

			case "No Grade Provided":

				Alert.alert(
					"No Grade Entered",
					"Please enter a valid grade.",
					[{text: 'OK', onPress: () => {}}],
					{cancelable: true}
				);
				return;
			
			case "Zero Denominator":

				Alert.alert(
					"Invalid Fraction",
					"The denominator cannot be 0.",
					[{text: 'OK', onPress: () => {}}],
					{cancelable: true}
				);
				return;

			case "Negative Values":

				Alert.alert(
					"Negative Values",
					"Please enter positive values",
					[{text: 'OK', onPress: () => {}}],
					{cancelable: true}
				);
				return;

			case "Missing Values":

				Alert.alert(
					"Missing Values",
					"Please input all required values.",
					[{text: 'OK', onPress: () => {}}],
					{cancelable: true}
				);
				return;
		}
	}

	back()
	{
		this.setState(prevState =>
		{
			return({currentScene: prevState.currentScene - 1});
		});
	}

	next()
	{
		this.setState(prevState =>
		{
			return({currentScene: prevState.currentScene + 1});
		});
	}

	inputGrade()
	{
		var selectedType = "";
		for (i in this.state.checkBoxValues)
		{
			if (this.state.checkBoxValues[i])
				selectedType = this.props.courseAssessmentTypes[i];
		}

		var chosenName = this.state.name == "" ? this.createNextName(this.props.courseAssessmentTypes[selectedType]) : this.state.name;

		var trueGrade = 0;
		if (this.state.useFraction)
			trueGrade = (this.state.numerator / this.state.denominator);
		else
			trueGrade = (this.state.percentage / 100);

		this.props.createAssessment(selectedType, chosenName, this.props.selectedCourse, trueGrade);
		this.props.navigation.pop();
	}

	createNextName(type)
	{
		if (type == Assessment.FINAL_EXAM)
			return Assessment.types[Assessment.FINAL_EXAM];

		var numberOfSameTypeAssessments = 0;
		for (id in this.props.sisterAssessments)
		{
			if (type == this.props.sisterAssessments[id].type)
				numberOfSameTypeAssessments++;
		}
		return Assessment.types[type] + " " + (numberOfSameTypeAssessments + 1).toString();
	}

	selectAssessType_SCENE()
	{
		return(
			<View style = {containerStyle.form}>
				<View style = {containerStyle.formSection}>
					<Text style = {textStyle.regular(22, 'center')}>Select the type of assessment you have completed.</Text>
				</View>
				<View style = {containerStyle.formSection}>
					<CheckList
						color = {colors.accentColor}
						fontSize = {22}
						labels = {this.state.checkBoxLabels}
						values = {this.state.checkBoxValues}
						onItemToggle = {(id) =>
						{
							var newArray = [];
							for (i in this.state.checkBoxValues)
								newArray.push(false);

							newArray[id] = true;
							this.setState({checkBoxValues: newArray});
						}}
					/>
				</View>
				<View style = {containerStyle.rowBox}>
					<Button
						label = "Next"
						color = {colors.primaryColor}
						inverted = {false}
						action = {() =>
						{
							var atLeastOneSelected = false;
							var selectedType;
							for (i in this.state.checkBoxValues)
							{
								if (this.state.checkBoxValues[i])
								{
									atLeastOneSelected = true;
									selectedType = i;
									break;
								}
							}

							if (!atLeastOneSelected)
								this.showAlert("No Type Selection Made");
							else
							{
								this.setState({name: this.createNextName(this.props.courseAssessmentTypes[selectedType])});
								this.next()
							}
						}}
					/>
				</View>
			</View>
		);
	}

	inputGrade_SCENE()
	{
		const convertToPercentage = (string, fallback) =>
		{
			if (string === "") return "";

			var attempt = parseFloat(string);
			if (Number(attempt) === attempt)
				return attempt;
			else
				return fallback;
		};

		const renderGradeInput = () =>
		{
			if (this.state.useFraction)
			{
				return(
					<View style = {{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
						<TextInput
							keyboardType = 'numeric'
							clearTextOnFocus = {true}
							defaultValue = {this.state.numerator == 0 ? "" : this.state.numerator.toString()}
							placeholderTextColor = 'rgba(0, 0, 0, 0.2)'
							underlineColorAndroid = {colors.primaryTextColor}
							returnKeyType = 'done'
							style = {[textStyle.regular(28, 'center'), {width: 75}]}
							onChangeText = {(newText) => {
								this.setState({numerator: convertToPercentage(newText, this.state.numerator)});
							}}
						/>
						<Text style = {textStyle.regular(24)}>/</Text>
						<TextInput
							keyboardType = 'numeric'
							clearTextOnFocus = {true}
							defaultValue = {this.state.denominator == 0 ? "" : this.state.denominator.toString()}
							placeholderTextColor = 'rgba(0, 0, 0, 0.2)'
							underlineColorAndroid = {colors.primaryTextColor}
							returnKeyType = 'done'
							style = {[textStyle.regular(28, 'center'), {width: 75}]}
							onChangeText = {(newText) => {
								this.setState({denominator: convertToPercentage(newText, this.state.denominator)});
							}}
						/>
					</View>
				);
			}
			else
			{
				return(
					<View style = {{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
						<TextInput
							keyboardType = 'numeric'
							clearTextOnFocus = {true}
							defaultValue = {this.state.percentage == 0 ? "" : this.state.percentage.toString()}
							placeholderTextColor = 'rgba(0, 0, 0, 0.2)'
							underlineColorAndroid = {colors.primaryTextColor}
							returnKeyType = 'done'
							style = {[textStyle.regular(28, 'center'), {width: 125}]}
							onChangeText = {(newText) => {
								this.setState({percentage: convertToPercentage(newText, this.state.percentage)});
							}}
						/>
						<Text style = {textStyle.regular(24)}>%</Text>
					</View>
				);
			}
		}

		var selectedType = "";
		var the = "the ";
		for (i in this.state.checkBoxValues)
		{
			if (this.state.checkBoxValues[i])
			{
				selectedType = Assessment.types[this.props.courseAssessmentTypes[i]];

				if (this.props.courseAssessmentTypes[i] == Assessment.ATTENDANCE || this.props.courseAssessmentTypes[i] == Assessment.PARTICIPATION)
					the = "";

				break;
			}
			
		}

		return(
			<View style = {containerStyle.form}>
				<View style = {containerStyle.formSection}>
					<Text style = {textStyle.regular(24, 'center')}>Enter the grade you received for {the}{selectedType.toLowerCase()} below.</Text>
				</View>
				<View style = {containerStyle.formSection}>
					{renderGradeInput()}
					<CheckList
						style = {{alignSelf: 'center', paddingVertical: 10, paddingRight: 40}}
						color = {colors.accentColor}
						fontSize = {18}
						labels = {["Use a fraction"]}
						values = {[this.state.useFraction]}
						onItemToggle = {(id) =>
						{
							this.setState({useFraction: !this.state.useFraction});
						}}
					/>
					<Divider color = {colors.spaceColor}/>
					<View style = {containerStyle.formSection}>
						<Text style = {textStyle.regular(24, 'center')}>(Optional) Provide a name for your {selectedType.toLowerCase()}.</Text>
					</View>
					<View style = {containerStyle.formSection}>
						<TextInput
							maxLength = {25}
							defaultValue = {this.state.name}
							onChangeText = {(newText) => this.setState({name: newText})}
							underlineColorAndroid = {colors.primaryTextColor}
							style = {textStyle.regular(24, 'center')}
						/>
						<Text style = {[textStyle.regular(14, 'center'), {paddingLeft: 3.5}]}>
							{selectedType} Name
						</Text>
					</View>
					<View style = {containerStyle.formSection}>
						<Button
							label = "Submit"
							color = {colors.accentColor}
							inverted = {false}
							action = {() =>
							{
								if (this.state.name != "")
								{
									for (id in this.props.sisterAssessments)
									{
										if (this.props.sisterAssessments[id].name == this.state.name)
										{
											this.showAlert("Name Used");
											return;
										}
									}
								}

								if (this.state.useFraction)
								{
									if (this.state.numerator === "" || this.state.denominator === "")
									{
										this.showAlert("Missing Values");
										return;
									}
									else if (this.state.denominator == 0)
									{
										this.showAlert("Zero Denominator");
										return;
									}
									else if (this.state.numerator < 0 || this.state.denominator < 0)
									{
										this.showAlert("Negative Values")
										return;
									}
								}
								else
								{
									if (this.state.percentage === "")
									{
										this.showAlert("No Grade Provided");
										return;
									}
									else if (this.state.percentage < 0)
									{
										this.showAlert("Negative Values");
										return;
									}
								}
								this.inputGrade();
							}}
						/>
						<Button
							label = "Back"
							color = {colors.accentColor}
							inverted = {true}
							action = {this.back.bind(this)}
						/>
					</View>
				</View>
			</View>
		);
	}

	render()
	{
		var scenes = [this.selectAssessType_SCENE(), this.inputGrade_SCENE()];

		return(
			<View style = {containerStyle.page}>
				<ScrollView>
					<ActionBar
						inverted = {true}
						leftButton =
						{
							<IconButton
								type = 'arrow-back'
								size = {30}
								color = {colors.primaryColor}
								action = {() => this.props.navigation.pop()}
							/>
						}
						title = "Input Grade"
					/>
					{scenes[this.state.currentScene]}
				</ScrollView>
			</View>
		);
	}
}

const mapStateToProps = (state) =>
{
	var validAssessmentTypes = [];
	var course = state.courseList[state.selectedCourse];
	for (i in course.breakdown)
	{
		if (course.breakdown[i] != 0)
			validAssessmentTypes.push(i);
	}

	var assessmentsInSameCourse = {};
	for (id in state.assessmentList)
	{
		if (state.assessmentList[id].courseID == state.selectedCourse)
			Object.assign(assessmentsInSameCourse, {[id]: state.assessmentList[id]})
	}

	return {
		sisterAssessments: assessmentsInSameCourse,
		courseAssessmentTypes: validAssessmentTypes,
		selectedSemester: state.selectedSemester,
		selectedCourse: state.selectedCourse
	};
};
export default connect(mapStateToProps, {createAssessment})(InputGradePage);