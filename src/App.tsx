import React, {useCallback, useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

var QRCode = require("qrcode");

function App() {
    const [qrCodeUrl, setQrCodeUrl] = React.useState<any>('');
    const [qrInputValue, setQrInputValue] = React.useState<any>('');

    const GenerateQr = (value: any) => {
        QRCode.toDataURL(value)
            .then((url: any) => {
                console.log("URL ==>", url);
                setQrCodeUrl(url);
            })
            .catch((err: any) => {
                console.error("Error ==>", err)
            });
    };

    const RenderQrCode = useCallback(() => {
        return <img className="mt-4" src={qrCodeUrl}/>
    }, [qrCodeUrl]);


    const handleChange = (event: any) => {
        setQrInputValue(event.target.value);
        GenerateQr(event.target.value);
    }

    const QrcodeInput = useCallback(() => {
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
                    value={qrInputValue} onChange={handleChange}/>
            </form>
        );
    }, [qrInputValue])

    return (
        <div className="pt-5 mx-auto px-4 flex-1">

            <QrcodeInput/>

            {/*<form>*/}
            {/*    <input type="text" value={qrInputValue} onChange={handleChange}/>*/}
            {/*</form>*/}

            {/*{GenerateQr("test Qr")}*/}

            <RenderQrCode/>

        </div>
    );
}

export default App;
