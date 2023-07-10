import React, {useState, useContext} from 'react';
import {Link} from 'react-router-dom';
import history from 'history/browser';
import {GlobalContext} from '../context/globalstate';

export const AddEmployee = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [designation, setDesignation] = useState('');
    const {addEmployee, employees} = useContext(GlobalContext);

    const onSubmit = (e) => {
        e.preventDefault();
        const newEmployee = {
            id: employees.length + 1,
            name,
            location,
            designation,
        };
        addEmployee(newEmployee);
        history.push('/');
    };

    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="name">Name of employee</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter name"
                        />
                    </div>
                    <div>
                        <label htmlFor="location">Location</label>
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            type="text"
                            placeholder="Enter location"
                        />
                    </div>
                    <div>
                        <label htmlFor="designation">Designation</label>
                        <input
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            type="text"
                            placeholder="Enter designation"
                        />
                    </div>
                    <div>
                        <button>Add Employee</button>
                    </div>
                    <div>
                        <Link to="/">Cancel</Link>
                    </div>
                </form>
            </div>
        </>
    );
};
