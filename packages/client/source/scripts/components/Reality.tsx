import React from 'react';
// import {withRouter} from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber'
import { SoftShadows, Float, CameraControls, Sky, PerformanceMonitor } from '@react-three/drei'

import Ocean from './Ocean'
// import style from '../../styles/scss/main.module.scss';

const Reality: React.FunctionComponent = () => {
    return (
        <>
            <Ocean />
        </>
    );
};

export default Reality;
