import React from 'react'
import CopyRight from './copy_right'
import FooterContent from './footer_content'

function Footer() {
    return (
        <div className="relative bg-blueGray-200 pt-8 pb-6">
            <div className="container mx-auto px-4">
                {/* <FooterContent /> */}
                <hr className="my-6 border-blueGray-300" />
                <CopyRight />
            </div>
        </div>
    )
}

export default Footer
