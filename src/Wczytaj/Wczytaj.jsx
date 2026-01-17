import React, { useState } from 'react';
import JSZip from 'jszip';
import Papa from 'papaparse';

const Wczytaj = () => {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Handler dla konkretnych plików - można rozszerzyć
    const fileHandlers = {
        stops: (data) => {
            console.log('Ładowanie danych stops:', data.length, 'wierszy');
            // Tutaj dodaj logikę przetwarzania danych stops
            // np. dispatch(setStops(data));
            window.stops = data;
            return data;
        },
        trips: (data) => {
            console.log('Ładowanie danych trips:', data.length, 'wierszy');
            window.trips = data;
            return data;
        },
        agency: (data) => {
            console.log('Ładowanie danych agency:', data.length, 'wierszy');
            window.agency = data;
            return data;
        },
        calendar_dates: (data) => {
            console.log('Ładowanie danych calendar_dates:', data.length, 'wierszy');
            window.calendar_dates = data;
            return data;
        },
        feed_info: (data) => {
            console.log('Ładowanie danych feed_info:', data.length, 'wierszy');
            window.feed_info = data;
            return data;
        },
        routes: (data) => {
            console.log('Ładowanie danych routes:', data.length, 'wierszy');
            window.routes = data;
            return data;
        },
        shapes: (data) => {
            console.log('Ładowanie danych shapes:', data.length, 'wierszy');
            window.shapes = data;
            return data;
        },
        stop_times: (data) => {
            console.log('Ładowanie danych stop_times:', data.length, 'wierszy');
            window.stop_times = data;
            return data;
        }
    };

    const processCSV = (csvString, fileName) => {
        return new Promise((resolve, reject) => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data.length === 0) {
                        resolve(null); // Pomijamy puste pliki
                    } else {
                        resolve(results.data);
                    }
                },
                error: (error) => {
                    reject(error);
                }
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
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(file);

            const fileNames = Object.keys(zipContent.files);
            const processedFiles = [];

            // Lista oczekiwanych plików (można rozszerzyć)
            const expectedFiles = ['agency.txt','calendar_dates.txt','feed_info.txt','shapes.txt','stops.txt', 'trips.txt', 'routes.txt', 'stop_times.txt'];

            for (const fileName of expectedFiles) {
                if (zipContent.files[fileName] && !zipContent.files[fileName].dir) {
                    setProgress(prev => ({
                        ...prev,
                        [fileName]: 'Przetwarzanie...'
                    }));

                    try {
                        const fileData = await zipContent.files[fileName].async('text');

                        if (fileData.trim()) {
                            const csvData = await processCSV(fileData, fileName);

                            if (csvData) {
                                // Wywołanie odpowiedniego handlera na podstawie nazwy pliku
                                const baseName = fileName.split('.')[0];
                                if (fileHandlers[baseName]) {
                                    const processed = fileHandlers[baseName](csvData);
                                    processedFiles.push({
                                        name: fileName,
                                        rows: csvData.length,
                                        data: processed
                                    });
                                }
                            }
                        }

                        setProgress(prev => ({
                            ...prev,
                            [fileName]: '✓ Zakończono'
                        }));

                    } catch (error) {
                        console.error(`Błąd przetwarzania ${fileName}:`, error);
                        setProgress(prev => ({
                            ...prev,
                            [fileName]: '✗ Błąd'
                        }));
                    }
                }
            }

            setUploadedFiles(processedFiles);
            this.props.onDataLoaded(processedFiles);
            // Sprawdź które pliki zostały znalezione
            const foundFiles = fileNames.filter(name => expectedFiles.includes(name));
            console.log('Znalezione pliki:', foundFiles);
            console.log('Przetworzone pliki:', processedFiles);

        } catch (error) {
            console.error('Błąd wczytywania ZIP:', error);
            alert('Błąd wczytywania pliku ZIP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="uploadArea">
                <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileUpload}
                    disabled={loading}
                    className="fileInput"
                    id="zip-upload"
                />
                <label htmlFor="zip-upload" className="uploadLabel">
                    {loading ? 'Przetwarzanie...' : 'Wybierz plik ZIP z danymi GTFS'}
                </label>

                {loading && (
                    <div className="progressContainer">
                        <h4>Postęp przetwarzania:</h4>
                        {Object.entries(progress).map(([fileName, status]) => (
                            <div key={fileName} className="progressItem">
                                <span className="fileName">{fileName}:</span>
                                <span style={getStatusStyle(status)}>{status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {uploadedFiles.length > 0 && (
                <div className="results">
                    <h3>Przetworzone pliki:</h3>
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="fileResult">
                            <strong>{file.name}</strong>: {file.rows} wierszy
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getStatusStyle = (status) => ({
    color: status === '✓ Zakończono' ? 'green' :
        status === '✗ Błąd' ? 'red' : '#666',
    fontWeight: status.includes('✓') || status.includes('✗') ? 'bold' : 'normal'
});

export default Wczytaj;