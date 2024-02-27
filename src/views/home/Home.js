import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {AdvancedImageList} from "./item-list/ImageList";

export const HomePage = ()=> {

    return (
        <React.Fragment>
            <CssBaseline />
             <AdvancedImageList />
        </React.Fragment>
    );
}
