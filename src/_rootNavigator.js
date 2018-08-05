// React Native components
import React, {Component} from 'react';

// React Navigation imports
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';

// Redux imports
import {connect} from 'react-redux';
import {loadSemesterList} from './appRedux/actions';

// Custom imports
import {NavDrawer} from 'easyGrades/src/common';

class RootNavigator extends Component
{
    constructor(props)
    {
        super(props);
        // this.props.loadSemesterList();        
    }

    render()
    {
        // Finding the last semester added to the app
        var latestSemester = 0;
        for (i in this.props.routeConfigs)
        {
            latestSemester = i;
        }

        var navConfig = {
            initialRouteName: latestSemester,
            contentComponent: ({navigation}) =>
            {
                return <NavDrawer navProp = {navigation}/>;
            }
        };

        var DrawerNavigator = createDrawerNavigator(this.props.routeConfigs, navConfig);
        
        return(
            <DrawerNavigator/>
        );
    }
}

// Imports for the following functions
import {AddCoursePage, CoursePage, SemesterPage} from 'easyGrades/src/semesterScreen';
import {NoSemestersPage, NewSemesterPage} from 'easyGrades/src/noSemestersScreen';
import AboutPage from 'easyGrades/src/aboutScreen/aboutPage';

const createSemesterPage = (semester) =>
{
    var routes = {};
    routes[semester.name] = {screen: SemesterPage}; // The actual page
    routes["Add Course"] = {screen: AddCoursePage}; // The page for adding a course to the semester

    // Creating pages for the individual courses
    for (i in semester.courses)
    {
        routes[semester.courses[i].name] = {screen: CoursePage};
    }

    // Returning a Stack Navigator
    return(createStackNavigator(routes, {headerMode: 'none'}));
}

const generateRouteConfigs = (semesterList) =>
{
    console.log(CoursePage);
    console.log(NewSemesterPage);
    console.log(NoSemestersPage);
    var routes = 
    {
        "About":
        {
            screen: AboutPage
        },
        "Settings":
        {
            screen: AboutPage
        },
        "New Semester": 
        {
            screen: createStackNavigator(
            {
                "No Semesters": NoSemestersPage,
                "Add Semester": NewSemesterPage
            },
            {
                headerMode: 'none',
                initialRouteName: "No Semesters"
            })
        }
    };

    for (i in semesterList)
    {
        routes[semesterList[i].name] = {screen: createSemesterPage(semesterList[i])};
    }

    return routes;
}

const mapStateToProps = (state) =>
{
    console.log("App State: ", state)
    return {
        routeConfigs: generateRouteConfigs(state.semesters),
        semesters: state.semesters
    };
};
export default connect(mapStateToProps, {loadSemesterList})(RootNavigator);