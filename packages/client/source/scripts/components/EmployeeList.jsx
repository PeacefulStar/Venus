import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {GlobalContext} from '../context/globalstate';

export const EmployeeList = () => {
    const {employees, removeEmployee, editEmployee} = useContext(GlobalContext);
    console.log(employees);
    console.log(editEmployee);
    return (
        <>
            {employees.length > 0 ? (
                <>
                    {employees.map((employee) => (
                        <div key={employee.id}>
                            <div>
                                <p>{employee.name}</p>
                                <p>{employee.designation}</p>
                                <span>{employee.location}</span>
                            </div>
                            <div>
                                <Link to={`/edit/${employee.id}`}>
                                    <button
                                        onClick={() =>
                                            editEmployee(employee.id)
                                        }>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="feather feather-edit">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                </Link>
                                <button
                                    onClick={() => removeEmployee(employee.id)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-trash-2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        <line x1="10" y1="11" x2="10" y2="17" />
                                        <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <p>No data</p>
            )}
        </>
    );
};
