import React, { useCallback } from 'react';
import './App.css';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode'
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import jszip from 'jszip';
import { resolve } from 'dns';
import excelLogo from './assets/excel.svg';
import Navbar from './components/navbar';
import Footer from './components/footer/footer';

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

        if (qrCodeArray.length <= 0) { return;}

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
            <form className="w-full">
                <input
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            <div className="bg-white text-center w-full px-4" {...getRootProps()}>
                <input {...getInputProps()} />
                <h2 className="font-semibold">
                    Upload your file
                </h2>


                <div className="border-dashed border-2 border-gray-200 w-full p-6 flex justify-center items-center flex-col my-6">
                    <img src={excelLogo} alt="Upload excel and generate QRcode" />
                    <span className="text-gray-400 text-sm">
                        Drag & Drop your file here
                    </span>
                </div>

            </div>
        )
    };

    return (
        <div>
            <Navbar />

            <div className="container mx-auto px-4 pt-5">

                <div className="grid grid-cols-8 gap-4">
                    <div className="col-start-2 col-span-6 text-center py-6">
                        <h1 className="mb-4">
                            QR Code generator
                        </h1>
                        <p className="text-gray-600 text-base font-light">
                            Free online Simple QR Code Generator. No sign-up required, You can generate bulk QRcode from excel file. Create and Download unlimited free QR code Images.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <div className="flex flex-col items-center bg-white p-4 pt-8 rounded-lg">
                        <h2 className="font-semibold mb-5">
                            Enter your url or text
                        </h2>
                        <QrcodeInput />
                        <RenderQrCode />
                        <button onClick={DownloadQrCode}
                            type="button"
                            className="px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="ml-2">Download</span>
                        </button>
                    </div>
                    <div className="flex flex-col items-center bg-white p-4 pt-8 rounded-lg">
                        <MyDropzone />
                        <button onClick={downloadZip}
                            type="button"
                            className={"px-4 py-3 bg-blue-600 rounded-md text-white outline-none focus:ring-4 shadow-lg transform active:scale-x-75 transition-transform mx-5 flex" + (qrCodeArray.length <= 0 && ' opacity-50 cursor-not-allowed')}
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span className="ml-2">Download Zip</span>
                        </button>
                    </div>
                </div>
            </div>

            <Footer />

        </div>
    );
}

export default App;
