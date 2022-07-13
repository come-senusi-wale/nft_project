import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa"

import logo  from "./../image/logo.jpg";


export let CompanyAsset = ({asset}) => {

    let [name, setName] = useState('');
    let [image, setImage] = useState('');
    let [description, setDescription] = useState('');

    useEffect(() => {
        
        let metadata = JSON.parse(asset.metadata);
       
        setName(metadata.name);
        setImage(metadata.image);
        setDescription(metadata.description)
    },[])

    return(
        <div className="company_asset">

            <div className="asset_header">
                <p className="name">{name}</p>
                <p className="pointer"><FaEllipsisV></FaEllipsisV></p>
            </div>

            <div className="image_contaniner">
                <img src={image} alt=""  />
            </div>

            <div className="company_asset_name">
                <h3>{name} #{asset.token_id}</h3>
                <p>{description}</p>
            </div>

            <div className="market_btn">
                <Link className="market" to={`market/${asset.token_id}`}>market</Link>
            </div>

        </div>
    )
}