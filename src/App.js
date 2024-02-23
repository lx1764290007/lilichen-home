import './App.css';
import { Routes, Route } from 'react-router-dom';
import {HomePage} from "./home/Home";
import {createTheme, ThemeProvider} from "@material-ui/core";
import {indigo} from '@material-ui/core/colors';

const outerTheme = createTheme({
    palette: {
        primary: {
            main: indigo[300]
        },
    },
});

function App() {
    return (
        <div className="App">
            <ThemeProvider theme={outerTheme}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="*" element={<HomePage />} />
            </Routes>
            </ThemeProvider>
        </div>
    );
}

export default App;
