import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Download, FileText, FileJson, Printer } from 'lucide-react';

const ExportOptions = ({ resumeRef, resumeData }) => {
    const exportAsPDF = async () => {
        const element = resumeRef.current;
        const opt = {
            margin: [0.5, 0.5],
            filename: `${resumeData?.personalInfo?.fullName || 'resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const exportAsJSON = () => {
        const dataStr = JSON.stringify(resumeData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData?.personalInfo?.fullName || 'resume'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const printResume = () => {
        const printContent = resumeRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Download size={18} /> Export Resume
            </h3>
            <div className="flex flex-wrap gap-2">
                <button 
                    onClick={exportAsPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    <FileText size={16} /> PDF
                </button>
                <button 
                    onClick={printResume}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                    <Printer size={16} /> Print
                </button>
                <button 
                    onClick={exportAsJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    <FileJson size={16} /> JSON
                </button>
            </div>
        </div>
    );
};

export default ExportOptions;