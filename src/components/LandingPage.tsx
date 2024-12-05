import React from "react";
import image from '../assets/undraw_open_note_cgre.png';
import {useNavigate} from "react-router-dom";

const LandingPage: React.FC = () => {

    const navigate = useNavigate()

    return (
        <div className="bg-gray-50 font-sans min-h-screen ">
            {/* Header */}
            <header className="bg-white shadow fixed top-0 w-full">
                <div onClick={() => navigate("/")}
                     className="container cursor-pointer mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-purple-600 text-2xl font-bold">SENUSA</h1>
                </div>
            </header>

            {/* Main Section */}
            <main className="container mx-auto px-6 py-24 min-h-screen">
                <div className="flex flex-col md:flex-row items-center">
                    {/* Text Content */}
                    <div className="md:w-1/2">
                        <h2 className="text-4xl text-gray-800 font-bold mb-4 leading-tight">
                            Automation of Genomic Variant Reporting and Summarization of Relevant Scientific Literature
                        </h2>
                        <p className="text-gray-600 text-lg mb-6">
                            <strong>Summarizing Your Literature</strong>
                            <br/>
                            We specialize in the automation of summarizing relevant scientific
                            literature, aiding laboratories in navigating the complexities of an
                            ever-changing landscape.
                        </p>
                        <p className="text-gray-600 text-lg mb-6">
                            <strong>Generating Variant Report</strong>
                            <br/>
                            Our expertise in automation extends to generating genomic variant
                            reports, empowering laboratories and genetic counselors.
                        </p>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg shadow hover:bg-purple-700"
                        >
                            Try Here
                        </button>
                    </div>

                    {/* Image Content */}
                    <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                        <img
                            src={image}
                            alt="Illustration"
                            className="w-3/4 md:w-full"
                        />
                    </div>
                </div>
            </main>
            <footer
                className='bg-gray-900 text-white flex items-center justify-center border-t py-4 fixed bottom-0 w-full'>
                <p>Copyright © 2023. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
