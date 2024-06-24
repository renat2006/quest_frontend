import React from "react";


const Icon = (props) => {

    return (
        <div className="icon" style={{ maskImage: `url(${props.img_src})`, WebkitMaskImage: `url(${props.img_src})` }} />

  )
}
export default Icon