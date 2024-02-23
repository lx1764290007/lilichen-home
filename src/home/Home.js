import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {HomePageAppBar} from "./app-header/AppHeader";

const Style = {
    container: {
        backgroundColor: 'aliceblue'
    }
}
export const HomePage = ()=> {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container style={Style.container} maxWidth="sm" fixed>
               <HomePageAppBar />
            </Container>
        </React.Fragment>
    );
}
