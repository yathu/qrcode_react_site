import React from 'react'

function CopyRight() {
    return (
        <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                    Copyright © <span id="get-current-year">2021</span>
                    <a href="#" className="text-blueGray-500 hover:text-gray-800" target="_blank" /> Notus JS by
                    <a href="#" className="text-blueGray-500 hover:text-blueGray-800">Creative Tim</a>.
                </div>
            </div>
        </div>
    )
}

export default CopyRight;
