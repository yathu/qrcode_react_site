import React, { useCallback } from 'react';
import './App.css';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode'
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import jszip from 'jszip';
import { resolve } from 'dns';
var _ = require('lodash');


//TODO:excel file validation
function App() {
    const [previewQrCode, setPreviewQrCode] = React.useState<any>('');
    const [qrInputValue, setQrInputValue] = React.useState<any>('');
    const [qrCodeArray, setQrCodeArray] = React.useState<any>([]);

    React.useEffect(() => {
        const val = qrInputValue ? qrInputValue : 'https://www.qr-generator-online.com/';
        QRCode.toDataURL(val)
            .then((url: any) => {
                console.log("URL ==>", url);
                setPreviewQrCode(url);
            })
            .catch((err: any) => {
                console.error("Error ==>", err)
            });

    }, [qrInputValue]);


    const RenderQrCode = () => {
        return <img className="mt-4" alt="qrcode" src={previewQrCode} />
    };

    const DownloadQrCode = () => {

        const val = qrInputValue ? qrInputValue : 'https://www.qr-generator-online.com/';
        const fileName = `${qrInputValue ? qrInputValue : 'QRcode'}.png`;

        QRCode.toCanvas(val, { errorCorrectionLevel: 'H' }, function (err: any, canvas: any) {
            if (err) throw err;

            canvas.toBlob(function (blob: any) {
                saveAs(blob, fileName);
            });

        });

    }

    const exportToBlob = (input: any) => {

        return new Promise((resolve, reject) => {

            QRCode.toDataURL(input)
                .then((url: any) => {
                    console.log("zip URL ==>", url);
                    resolve(url);
                })
                .catch((err: any) => {
                    console.error("Error ==>", err)
                });
        });

    };

    const downloadZip = async () => {
        var zip = new jszip();

        new Promise(resolve => {

            qrCodeArray.forEach((value: any) => {

                exportToBlob(value).then((url: any) => {
                    zip.file(`${value}.png`, url.split('base64,')[1], { base64: true });
                    resolve(true);
                });
            });

        }).then(() => {

            zip.generateAsync({ type: "blob" }).then(function (content) {
                saveAs(content, "QRcodes.zip");
                setQrCodeArray([]);
            });

        });

    }


    const handleChange = (event: any) => {
        setQrInputValue(event.target.value);
    }

    const QrcodeInput = () => {
        return (
            <form>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ref={(input) => {
                        if (input) {
                            input.focus();
                        }
                    }}
                    type="text" placeholder="URL/Text"
                    value={qrInputValue} onChange={handleChange} />
            </form>
        );
    };

    const MyDropzone = () => {
        const onDrop = useCallback((acceptedFiles) => {
            acceptedFiles.forEach((file: any) => {

                var name = file.name;
                const reader = new FileReader();

                reader.onabort = () => console.log('file reading was aborted')
                reader.onerror = () => console.log('file reading has failed')
                reader.onload = (evt: any) => {

                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });

                    console.log("wb", wb);

                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data: any = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

                    /* Update state */
                    const final = _.compact(_.flatten(data));

                    setQrCodeArray(final);
                }

                reader.readAsBinaryString(file);
            })

        }, [])
        const { getRootProps, getInputProps } = useDropzone({ onDrop })

        return (
            <div className="bg-white" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                <div className="py-8 px-8 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
                    <img className="block mx-auto h-24 rounded-full sm:mx-0 sm:flex-shrink-0" src="/img/erin-lindford.jpg" alt="Woman's Face" />
                    <div className="text-center space-y-2 sm:text-left">
                        <div className="space-y-0.5">
                            <p className="text-lg text-black font-semibold">
                                Erin Lindford
                            </p>
                            <p className="text-gray-500 font-medium">
                                Product Engineer
                            </p>
                        </div>
                        <button className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2">Message</button>
                    </div>
                </div>
            </div>
        )
    };

    return (
        <div className="pt-5 mx-auto px-4 flex-1">

            <MyDropzone />

            <QrcodeInput />

            <RenderQrCode />

            <button onClick={DownloadQrCode}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download</span>
            </button>


            <button onClick={DownloadQrCode}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>Download codes</span>
            </button>
            <br />
            <button onClick={downloadZip}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                </svg>
                <span>downloadZip</span>
            </button>

        </div>
    );
}

export default App;
