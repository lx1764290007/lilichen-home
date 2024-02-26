import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import {HomePageAppBar} from "./app-header/AppHeader";
import {AdvancedImageList} from "./item-list/ImageList";
const Style = {
    container: {
        backgroundColor: 'aliceblue',
        padding: 0
    }
}
export const HomePage = ()=> {

    return (
        <React.Fragment>
            <CssBaseline />
            <Container style={Style.container} maxWidth="md" fixed>
               <HomePageAppBar />
                <AdvancedImageList />
            </Container>
        </React.Fragment>
    );
}
