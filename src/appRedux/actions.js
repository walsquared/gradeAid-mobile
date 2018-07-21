// Redux imports
import * as actionTypes from './actionTypes';

// ---------------------------------------------------------------------------------------
// SET MAX GPA
// ---------------------------------------------------------------------------------------

export const setMaxGPA = (newGPA) =>
{
    return {
        type: actionTypes.SET_MAX_GPA,
        payload: newGPA
    };
}

// ---------------------------------------------------------------------------------------
// SEMESTER ACTIONS
// ---------------------------------------------------------------------------------------

var assessments = [
    {name: "Assignment 1", grade: 80},
    {name: "Assignment 2", grade: 55},
    {name: "Midterm 1", grade: 92.2},
    {name: "Assignment 3", grade: 56},
    {name: "Lab 1", grade: 66},
    {name: "Assignment 4", grade: 100},
    {name: "Midterm 2", grade: 70},
    {name: "Assignment 5", grade: 65}
];

var courses = [
    {name: "COMP 1405", average: 90, assessments},
    {name: "MATH 1007", average: 78, assessments},
    {name: "MATH 1004", average: 85, assessments},
    {name: "CGSC 1001", average: 67, assessments},
    {name: "MUSI 1701", average: 72, assessments}
];

var semesters = [
    {name: 'Fall 2016', courses, gpa: 9.6},
    // {name: 'Winter 2017', courses, gpa: 8.0},
    // {name: 'Fall 2017', courses, gpa: 10.2},
    // {name: 'Winter 2018', courses, gpa: 6.4},
    // {name: 'Fall 2018', courses, gpa: 11.8}
]

var newSemesters = [
    {name: 'Winter 2017', courses, gpa: 8.0},
    {name: 'Fall 2017', courses, gpa: 10.2},
    {name: 'Winter 2018', courses, gpa: 6.4},
    {name: 'Fall 2018', courses, gpa: 11.8}
]
var counter = -1;

export const newSemester = (semester) =>
{
    counter++;
    return {
        type: actionTypes.NEW_SEMESTER,
        payload: newSemesters[counter]
    };
}

export const loadSemesterList = () =>
{
    return {
        type: actionTypes.LOAD_SEMESTER_LIST,
        payload: semesters
    };
}