import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa"

import logo  from "./../image/logo.jpg";

import { useMoralisWeb3Api, useMoralis, useWeb3ExecuteFunction} from "react-moralis";
import Moralis from "moralis";


export let GeneralAsset = ({expiredItem}) => {

    const Web3Api = useMoralisWeb3Api();

    const { isAuthenticated } = useMoralis();

    const { fetch  } = useWeb3ExecuteFunction();

    let [name, setName] = useState('');
    let [image, setImage] = useState('');
    let [description, setDescription] = useState('');

    let [recieviving, setReciving] = useState(false);


    let contractNFT =  () => {

        let { metadata} = expiredItem;

        //console.log(JSON.parse(correct_product[0].metadata));

        let metadatas = JSON.parse(metadata);

        setName(metadatas.name);
        setImage(metadatas.image);
        setDescription(metadatas.description)

        
    }



    // function to recieve expired product from market 

    let recieve = async (e) => {

      
        let id = e.target.getAttribute('data-id');
        console.log(id);

        if (!isAuthenticated) {

            alert('plaest connect your metamask wallet on binance test network please.....');
            
        }else{

            setReciving(true);

            await  Moralis.enableWeb3();

            let option = {
                abi: [
                    {
                        "inputs": [
                          {
                            "internalType": "uint256",
                            "name": "_itemId",
                            "type": "uint256"
                          }
                        ],
                        "name": "dueNft",
                        "outputs": [],
                        "stateMutability": "nonpayable",
                        "type": "function"
                      }
                ],
                contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',
                functionName: "dueNft",
                params: {
                _itemId : id
                },
    
                
            }


            await fetch({
                params: option,
    
                onSuccess: (succ) => {
                
                    alert('Expired NFT successfully recived');   
                    window.location.reload();  
                },
    
                onError: (erroe) => {
                    alert('Expired NFT fail to recived')
                    
                }
            })

            setReciving(false);


        }

    }


    useEffect(() => {

        contractNFT();

    }, [])



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
                <h3>{name} #{expiredItem.token_id}</h3>
                <p>{description}</p>
            </div>

            <div className="market_btn">
                <Link className="market" to='#' data-id={expiredItem.itemId} onClick={(e) => recieve(e)}>{recieviving ? 'recieving...' : 'recieve'}</Link>
            </div>

        </div>
    )
}