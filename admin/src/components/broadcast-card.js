

import "../css/broadcast.css";

const Broadcastcard = ({title,imageicon,number,loading,id}) => {
    return (
        <>
            <div className = "broadcast-card">
                <div className = "card-inner">
                    <div className = "broadcast-header">
                        <span></span>{title}
                    </div>
                    {!loading ? <div className = "broadcast-body">
                        <div className = "card-content d-flex align-items-center justify-content-center">
                            <div className = "icon-s">
                                {id?<img src = {imageicon} alt = "b-icon" id={id}/> :<img src = {imageicon} alt = "b-icon"/>}
                            </div>
                            <div className = "number-s">
                                {number}
                            </div>
                        </div>
                    </div>:
                    <div className = "broadcast-body placeholder-glow">
                        <div className = "placeholder w-75 py-2 mx-auto d-block"></div>
                    </div>
                    }
                </div>
            </div>
        </>
    )
}

export default Broadcastcard;