// React Native components
import React, {Component} from 'react';

// React Navigation imports
import {createDrawerNavigator, createStackNavigator} from 'react-navigation';

// Redux imports
import {connect} from 'react-redux';

// Custom imports
import NavDrawer from 'easyGrades/src/navDrawer/navDrawer';
import * as Modals from 'easyGrades/src/modals';
import NoSemestersPage from 'easyGrades/src/noSemestersScreen/noSemestersPage';
import AboutPage from 'easyGrades/src/aboutScreen/aboutPage';
import SettingsPage from 'easyGrades/src/settingsScreen/settingsPage';
import {CoursePage, SemesterPage} from 'easyGrades/src/semesterScreen';

class RootNavigator extends Component
{
    shouldComponentUpdate(nextProps)
    {
        return false;
    }

    render()
    {        
        var landingPage = Object.keys(this.props.semesterList).length == 0 ? 
            "No Semesters" : "Semester Screen";
        
        var drawerNavConfig = 
        {
            initialRouteName: landingPage,
            contentComponent: ({navigation}) =>
            {
                return <NavDrawer navigation = {navigation}/>;
            }
        };

        var DrawerNavigator = createDrawerNavigator(this.props.drawerRoutes, drawerNavConfig);

        var mainRoutes = Object.assign(this.props.modalRoutes, {"Drawer": DrawerNavigator});
        var MainNavigator = createStackNavigator(mainRoutes,
        {
            headerMode: 'none',
            initialRouteName: "Drawer"
        });

        return (
            <MainNavigator/>
        );
    }
}

const mapStateToProps = (state) =>
{
    console.log("App State: ", state);

    var modalRoutes = {};
    for (modal in Modals)
    {
        modalRoutes[modal] = {screen: Modals[modal]}
    }

    var semesterScreen = createStackNavigator(
    {
        Semester: {screen: SemesterPage},
        Course: {screen: CoursePage}
    },
    {
        headerMode: 'none',
        initialRouteName: "Semester"
    });

    return {
        semesterList: state.semesterList,
        courseList: state.courseList,
        assessmentList: state.assessmentList,
        modalRoutes,
        drawerRoutes:
        {
            "About": {screen: AboutPage},
            "Settings": {screen: SettingsPage},
            "No Semesters": {screen: NoSemestersPage},
            "Semester Screen": semesterScreen
        }
    };
}
export default connect(mapStateToProps)(RootNavigator);