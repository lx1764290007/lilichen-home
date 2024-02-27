import React from 'react';
import {useContainerWithoutNavigationBarStyle} from '../../App';

export const Login = ()=> {
    const classes = useContainerWithoutNavigationBarStyle();
    return (
        <div className={classes.container}>
            <h2>登录</h2>
        </div>
    )
}
