import React from 'react';
import {Link} from 'react-router-dom';

import style from '../../styles/scss/main.module.scss';

const Navigation: React.FunctionComponent = () => {
    return (
        <nav>
            <div className={style.left_nav}>
                <ul>
                    <li>
                        <Link to={'/'}>
                            <div className={style.home_link}>Home</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/reality'}>
                            <div className={style.global_link}>Reality</div>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/contact'}>
                            <div className={style.global_link}>Contact</div>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className={style.right_nav}>
                <Link to={'/signup'}>SignUp</Link>
                <Link to={'/login'}>Login</Link>
            </div>
        </nav>
    );
};

export default Navigation;
