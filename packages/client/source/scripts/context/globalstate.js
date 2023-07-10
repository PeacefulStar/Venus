import React, {createContext, useReducer} from 'react';
import PropTypes from 'prop-types';

const initialState = {
    employees: [
        {
            id: 1,
            name: 'Ishan Manandhar',
            location: 'Kathmandu',
            designation: 'Frontend Dev',
        },
    ],
    authUser: null,
    loading: true,
};

const reducer = (state, action) => {
    const updatedEmployee = action.payload;

    const updatedEmployees = state.employees.map((employee) => {
        if (employee.id === updatedEmployee.id) {
            return updatedEmployee;
        }
        return employee;
    });

    switch (action.type) {
        case 'SET_AUTH_USER':
            return {
                ...state,
                authUser: action.authUser,
                loading: false,
            };
        case 'REMOVE_EMPLOYEE':
            return {
                ...state,
                employees: state.employees.filter(
                    (employee) => employee.id !== action.payload,
                ),
            };
        case 'ADD_EMPLOYEES':
            return {
                ...state,
                employees: [...state.employees, action.payload],
            };
        case 'EDIT_EMPLOYEE':
            return {
                ...state,
                employees: updatedEmployees,
            };
        default:
            return state;
    }
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const signUp = (user) => {
        dispatch({
            type: 'SET_AUTH_USER',
            payload: user,
        });
    };

    const removeEmployee = (id) => {
        dispatch({
            type: 'REMOVE_EMPLOYEE',
            payload: id,
        });
    };

    const addEmployee = (employees) => {
        dispatch({
            type: 'ADD_EMPLOYEES',
            payload: employees,
        });
    };

    const editEmployee = (employees) => {
        dispatch({
            type: 'EDIT_EMPLOYEE',
            payload: employees,
        });
    };

    return (
        <GlobalContext.Provider
            value={{
                employees: state.employees,
                removeEmployee,
                addEmployee,
                editEmployee,
                authUser: state.authUser,
                signUp,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};

GlobalProvider.propTypes = {
    children: PropTypes.object,
};
