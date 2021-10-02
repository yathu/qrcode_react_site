import React, { useCallback } from 'react';
import './App.css';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode'
import Dropzone, { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import jszip from 'jszip';
import { resolve } from 'dns';
// import * as lodash from 'lodash';
var _ = require('lodash');



function App() {
    const [previewQrCode, setPreviewQrCode] = React.useState<any>('');
    const [qrInputValue, setQrInputValue] = React.useState<any>('');

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

            console.log("canvas ==>");
            console.log(canvas);

            canvas.toBlob(function (blob: any) {

                console.log("blob ==>");
                console.log(blob);

                saveAs(blob, fileName);
            });

        });

    }

    const exportToBlob = (input: any) => {

        console.log("input", input);
        // let blobImg;

        return new Promise((resolve, reject) => {

            QRCode.toDataURL(input)
                .then((url: any) => {
                    console.log("zip URL ==>", url);
                    resolve(url);
                })
                .catch((err: any) => {
                    console.error("Error ==>", err)
                });


            // zip.generateAsync({type:"blob"}).then(function(content) {
            //     saveAs(content, "edm8.zip");
            // }); 

            // QRCode.toCanvas(input, { errorCorrectionLevel: 'H' }, function (err: any, canvas: any) {
            //     if (err) throw err;

            //     canvas.toBlob(function (blob: any) {
            //         console.log("blob data==>", blob);
            //         resolve(blob);
            //         // blobImg = blob
            //     });

            // });


        });

    };

    const downloadZip = async () => {

        // zip.file("image.png", blob);
        const values = ["100", "1001"];

        var zip = new jszip();
        var img = zip.folder("images");


        new Promise(resolve => {

            console.log(1);

            values.forEach((value) => {
                console.log(2);

                exportToBlob(value).then((url: any) => {

                    console.log(3);

                    console.log("blobImg url ======>", url);

                    zip.file(`${value}.png`, url.split('base64,')[1], { base64: true });

                    resolve(true);

                });
            });




        }).then(() => {
            console.log(4);

            zip.generateAsync({ type: "blob" }).then(function (content) {
                // see FileSaver.js
                saveAs(content, "QRcodes.zip");
            });

        });

        // zip.file("image.png", blob);
        // zip.file("file.txt", "content");
        // zip.file("file1.txt", "content1");


        // zip.generateAsync({ type: "blob" }).then(function (content) {
        //     // see FileSaver.js
        //     saveAs(content, "example.zip");
        // });
        // zip_.file(filename, data, {binary:true});
        // const blob = exportToBlob("100");

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
                    // Do whatever you want with the file contents
                    // const binaryStr = reader.result
                    // console.log(binaryStr)

                    /* Parse data */
                    const bstr = evt.target.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });

                    console.log("wb", wb);

                    /* Get first worksheet */
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    /* Convert array of arrays */
                    const data: any = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

                    /* Update state */
                    console.log("Data>>>" + data);
                    console.log(data);

                    const final = _.compact(_.flatten(data));

                    console.log("final");
                    console.log(final);

                    // var myNewArray4 = [].concat(...data);

                    // console.log("myNewArray4:");
                    // console.log(myNewArray4);

                    // var myNewArray5 = data.flat();
                    // console.log(myNewArray5);


                }
                // reader.readAsArrayBuffer(file)
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
