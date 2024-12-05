import React from "react";
import {Routes, Route} from "react-router-dom";
import LandingPage from "./components/LandingPage";
import "./index.css";
import Dashboard from "./components/Dashboard";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
    );
};

export default App;
