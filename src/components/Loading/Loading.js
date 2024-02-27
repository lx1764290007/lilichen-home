import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


export const Loading =()=> {
    return (
        <div style={{textAlign: "center"}}>
            <CircularProgress size={20} />
        </div>
    );
}
