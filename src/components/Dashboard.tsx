import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {
    const [apiResponse, setApiResponse] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set()); // Track selected rows
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Define headers dynamically
    const headers = [
        {label: "#Uploaded_variation", key: "input"},
        {label: "Location", key: (data: any) => `${data.seq_region_name}:${data.start}-${data.end}`},
        {label: "Allele", key: "allele_string"},
        {label: "Consequence", key: "most_severe_consequence"},
        {label: "IMPACT", key: (data: any) => data.transcript_consequences?.[0]?.impact || "-"},
        {label: "SYMBOL", key: (data: any) => data.transcript_consequences?.[0]?.gene_symbol || "-"},
        {label: "Feature_Type", key: (data: any) => data.transcript_consequences?.[0]?.feature_type || "-"},
        {label: "Feature", key: (data: any) => data.transcript_consequences?.[0]?.transcript_id || "-"},
        {label: "BIOTYPE", key: (data: any) => data.transcript_consequences?.[0]?.biotype || "-"},
        {label: "EXON", key: (data: any) => data.transcript_consequences?.[0]?.exon || "-"},
        {label: "HGVSc", key: (data: any) => data.transcript_consequences?.[0]?.hgvsc || "-"},
        {label: "PHENOTYPES", key: (data: any) => data.colocated_variants?.[1]?.phenotype_or_disease || "-"},
    ];

    const chunkArray = (array: string[], chunkSize: number) => {
        const result: string[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e: any) => {
                const text = e.target.result;
                const json = parseVCFToJson(text);

                if (json.variants.length > 0) {
                    await postToApi(json);
                } else {
                    alert("No valid variants found in the file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const parseVCFToJson = (vcfContent: string) => {
        const lines = vcfContent.split("\n");
        const variants: string[] = [];

        lines.forEach((line: string) => {
            if (line.startsWith("#")) return;

            const columns = line.split("\t");
            if (columns.length > 1) {
                const variant = columns.slice(0, 8).join(" ");
                variants.push(variant);
            }
        });

        return {variants};
    };

    const postToApi = async (json: { variants: string[] }) => {
        const apiUrl = "https://rest.ensembl.org/vep/human/region/";
        const variantChunks = chunkArray(json.variants, 200);

        try {
            setLoading(true);
            setError(null);
            const allResponses = [];
            for (const chunk of variantChunks) {
                const response = await axios.post(apiUrl, {variants: chunk}, {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                allResponses.push(...response.data);
            }
            setApiResponse(allResponses);
        } catch (error) {
            setError("Failed to fetch data from API. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRowSelection = (index: number) => {
        const updatedSelection = new Set(selectedRows);
        if (updatedSelection.has(index)) {
            updatedSelection.delete(index);
        } else {
            updatedSelection.add(index);
        }
        setSelectedRows(updatedSelection);
    };

    const generateReport = () => {
        const selectedData = Array.from(selectedRows).map(index => apiResponse[index]);
        console.log("Generate Report for:", selectedData);
        // Implement report generation logic
    };

    const generateSummarize = () => {
        const selectedData = Array.from(selectedRows).map(index => apiResponse[index]);
        console.log("Generate Summarize for:", selectedData);
        // Implement summary generation logic
    };

    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 min-h-screen h-full w-screen font-sans">
            <header className="bg-white shadow">
                <div onClick={() => navigate("/")}
                     className="container cursor-pointer mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-purple-600 text-2xl font-bold">SENUSA</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10">
                <div className="mb-6">
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Upload Your VCF File
                    </label>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        className="block w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                </div>

                {loading && <p className="text-black ">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-black animate-spin"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"/>
                    </svg>
                    Please wait...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && apiResponse.length > 0 && (
                    <div className="overflow-y-auto max-h-[80vh] overflow-x-auto border border-gray-300 rounded-lg shadow">
                        <table className="table-auto w-full bg-white">
                            <thead className="bg-purple-600 text-white sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedRows(new Set(apiResponse.map((_, i) => i)));
                                            } else {
                                                setSelectedRows(new Set());
                                            }
                                        }}
                                    />
                                </th>
                                {headers.map((header) => (
                                    <th className="px-4 py-2 text-left " key={header.label}>
                                        {header.label}
                                    </th>
                                ))}
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {apiResponse.map((variant, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                                >
                                    <td className="border px-4 py-2 text-black">
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.has(index)}
                                            onChange={() => toggleRowSelection(index)}
                                        />
                                    </td>
                                    {headers.map((header) => (
                                        <td className="border px-4 py-2 text-black" key={header.label}>
                                            {typeof header.key === "function"
                                                ? header.key(variant)
                                                : variant[header.key] || "-"}
                                        </td>
                                    ))}
                                    <td className="border px-4 py-2 text-black">
                                        <div className="flex space-x-2">
                                            <button
                                                className="bg-green-500 text-white px-3 py-1 rounded"
                                                onClick={generateReport}
                                            >
                                                Generate Report
                                            </button>
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                                onClick={generateSummarize}
                                            >
                                                Generate Summarize
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
