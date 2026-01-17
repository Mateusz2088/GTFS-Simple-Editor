import React, { useState } from 'react';
import JSZip from 'jszip';
import Papa from 'papaparse';

const Wczytaj = ({ onDataLoaded }) => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const processCSV = (csvString) => {
        return new Promise((resolve, reject) => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => resolve(results.data),
                error: reject
            });
        });
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);
        setProgress({});
        setUploadedFiles([]);

        try {
            const zip = await JSZip.loadAsync(file);
            const expectedFiles = [
                'agency.txt', 'calendar_dates.txt', 'feed_info.txt',
                'routes.txt', 'shapes.txt', 'stops.txt',
                'stop_times.txt', 'trips.txt'
            ];

            const GTFSData = {
                agency: [],
                calendar_dates: [],
                feed_info: [],
                routes: [],
                shapes: [],
                stops: [],
                stop_times: [],
                trips: []
            };

            for (const fileName of expectedFiles) {
                if (zip.files[fileName]) {
                    setProgress(prev => ({ ...prev, [fileName]: 'Przetwarzanie...' }));
                    try {
                        const fileData = await zip.files[fileName].async('text');
                        const csvData = await processCSV(fileData);
                        const key = fileName.replace('.txt', '');
                        GTFSData[key] = csvData;
                        setProgress(prev => ({ ...prev, [fileName]: '✓ Zakończono' }));
                    } catch (err) {
                        setProgress(prev => ({ ...prev, [fileName]: '✗ Błąd' }));
                        console.error(`Błąd przy ${fileName}:`, err);
                    }
                }
            }

            setUploadedFiles(Object.keys(GTFSData).map(k => ({ name: k, rows: GTFSData[k]?.length || 0 })));
            onDataLoaded(GTFSData);

        } catch (error) {
            console.error('Błąd wczytywania ZIP:', error);
            alert('Błąd wczytywania pliku ZIP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <input type="file" accept=".zip" onChange={handleFileUpload} disabled={loading} />
            {loading && (
                <div>
                    <h4>Postęp:</h4>
                    {Object.entries(progress).map(([f, s]) => (
                        <div key={f}>
                            {f}: <span style={{ color: s.includes('✓') ? 'green' : s.includes('✗') ? 'red' : '#666' }}>{s}</span>
                        </div>
                    ))}
                </div>
            )}
            {uploadedFiles.length > 0 && (
                <div>
                    <h3>Przetworzone pliki:</h3>
                    {uploadedFiles.map((f, i) => (
                        <div key={i}>{f.name}: {f.rows} wierszy</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wczytaj;