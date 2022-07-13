import React, {useEffect, useState} from "react";

import  "./../../css/asset.css";

import { CompanyAsset } from "./../companyAsset";
import { GeneralAsset } from "./../generalAsset";

import { Footer } from "./../footer";

import { useMoralisWeb3Api, useMoralis, useWeb3ExecuteFunction } from "react-moralis"
import Moralis from "moralis";


export let Asset = () => {

    const Web3Api = useMoralisWeb3Api();

    const { data, error:contractErr, fetch, isFetching, isLoading,  } = useWeb3ExecuteFunction();

    const {account, isAuthenticated} = useMoralis();

    let [asset, setAsset] = useState([]);
    let [loadingCompanyAsset, setLoadingCompanyAsset] = useState(false);
    let [loadingexpiredItem, setLoadingexpiredItem] = useState(false)

    let [noCompanyAsset, setNoCompanyAsset] = useState(false);
    let [noexpiredItem, setNoexpiredItem] = useState(false);

    let [signIn, setSignIn] = useState(false);

    let [recieveItems, setRecieveItems] = useState([]);

    let loadAsset = async () => {

        if (!isAuthenticated) {

            setSignIn(true);
            
        }else{

        
            setSignIn(false);
       

            const serverUrl = "https://gdk00s30yy5s.usemoralis.com:2053/server";
            const appId = "k4DmY8xmLVPquxmpk2Yz0wh1Bu38nzwZ5WqJzYqt";
            Moralis.start({ serverUrl, appId });

            setLoadingCompanyAsset(true);
    

            const options = {
                chain: "bsc testnet",
                
                //token_address: "0x2161EB08f1f16c1E68fa415A400cB2F3DCb37077"
                token_address: "0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C"
                
            };
            const yourNFT = await Web3Api.account.getNFTsForContract(options);
            //console.log(yourNFT);

            let result = await yourNFT.result;
            setAsset(result);   
            
            setLoadingCompanyAsset(false)

            if (result.length > 0) {

                setNoCompanyAsset(false)
                
            }else{

                setNoCompanyAsset(true);
            }

        }
            
    }



    // function for expired item ::::::::::::::::::::::

    let dueItem = async () => {

        if (!isAuthenticated) {

            setSignIn(true);
            
        }else{

        
            setSignIn(false);

            setLoadingexpiredItem(true)

            await Moralis.enableWeb3();

            
            let option = {
                abi: [
                    {
                        "inputs": [],
                        "name": "itemCount",
                        "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                        ],
                        "stateMutability": "view",
                        "type": "function",
                        "constant": true
                    }
                ],

                contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',

                functionName: "itemCount",

                
            }

            

            let see = await fetch({
                params: option,

                onSuccess: (succe) => {
                

                },

                onError: (erroe) => {
                    alert(erroe);
                    //console.log(erroe);
                    
                }
            })

            //console.log(see);

            let come = parseInt(see._hex, 16)
            //console.log(come);



            // for fetching market product :::::::::::::

            let arr = []

            for (let i = 0; i < come; i++) {
                
                let num = i + 1;
                
            


                let optionTwo = {
                    abi: [
                        {
                            "inputs": [
                            {
                                "internalType": "uint256",
                                "name": "",
                                "type": "uint256"
                            }
                            ],
                            "name": "companyMarket",
                            "outputs": [
                            {
                                "internalType": "uint256",
                                "name": "itemId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "contract IERC721",
                                "name": "nft",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "tokenId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "itemPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address payable",
                                "name": "seller",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "time",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "solTime",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "sold",
                                "type": "bool"
                            }
                            ],
                            "stateMutability": "view",
                            "type": "function",
                            "constant": true
                        }
                    ],

                    contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',

                    functionName: "companyMarket",

                    params: {
                        '' : num    
                    }

                    
                }

                


                let succ = await fetch({
                    params: optionTwo,

                    onSuccess: (succe) => {
                    
                    },

                    onError: (erroe) => {
                        alert(erroe)
                        //console.log(erroe);
                        
                    }
                })


                
                let itemId = parseInt(succ[0]._hex, 16);
                let token_id = parseInt(succ[2]._hex, 16);
                let time = parseInt(succ[5]._hex, 16);
                let amount = parseInt(succ[3]._hex, 16);
                let sold = succ[7];
                let owner = succ[4];

                

                let obj = {itemId, token_id, time, amount, sold, owner};

                arr.push(obj);

                
            
            }

            //console.log(arr);

            let products = arr.filter((data) => {
                return ((data.time < new Date().getTime()) && (data.sold == false) && (data.owner.toLowerCase() == account) );
            })

            //console.log(products);


            const options = {
                address: "0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C",
                chain: "bsc testnet",
            };

            const NFTs = await Web3Api.token.getAllTokenIds(options);
            //console.log(NFTs);

            let results = NFTs.result;
            //console.log(results);

            let expiredProducts = [];

            products.forEach((product) => {
                let objTwo = {};

                let item = results.filter((data) => {

                    return(data.token_id == product.token_id)
                })

                //console.log(item);

                objTwo = {
                    token_id : item[0].token_id,
                    metadata: item[0].metadata,
                    itemId: product.itemId
                };

                //console.log(objTwo);

                expiredProducts.push(objTwo);

                //console.log(expiredProducts);
            })


            const optionTwos = {
                chain: "bsc testnet",

                address: "0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C",
                
                //token_address: "0x2161EB08f1f16c1E68fa415A400cB2F3DCb37077"

                token_address: "0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C"
                
            };
            const yourNFT = await Web3Api.account.getNFTsForContract(optionTwos);
            //console.log(yourNFT);

            let yourNFTResult = await yourNFT.result;

            //console.log(yourNFTResult);

            //console.log(expiredProducts);

            let realExpiredProducts = [];

            expiredProducts.forEach((data) => {

                let objTre = {};

                let items = yourNFTResult.filter((item) => {
                    return(item.token_id == data.token_id)
                })

                //console.log(items);

                if (items.length > 0) {

                    objTre = {
                        token_id : items[0].token_id,
                        metadata: items[0].metadata,
                        itemId: data.itemId
                    };

                    realExpiredProducts.push(objTre);
                    
                }


                //console.log(objTre);
            })

            //console.log(realExpiredProducts);

            // checking if there is any expired product :::::::::::::::::::::::

            if (realExpiredProducts.length > 0) {

                setNoexpiredItem(false);
                
            }else{

                setNoexpiredItem(true);
            }


            setRecieveItems(realExpiredProducts);

            setLoadingexpiredItem(false);

        }
        
        
    }

   
    


    useEffect( () => {
   
        loadAsset();

    }, [])


    return(<>

        <section id="asset">

            <section id="contract_asset">

                <div id="contract_asset_header">
                    <h2> company product's asset</h2>

                    {loadingCompanyAsset ? 

                        <p>loading asset please wait...</p> : ""

                    }

                </div>

                <div className="contract_asset_container">

                    {signIn ? <p className="error">connect your metamask wallet on binance test network to check if you have any asset please....</p> : 

                        noCompanyAsset ? 
                            
                            <h3 className="no_company_asset">you don't have any asset please.....</h3> :
                        
                            asset.map((ass) => {

                                return(
                                    <CompanyAsset key={ass.token_id} asset={ass}></CompanyAsset>
                                )

                            })
                    

                    

                    }

                    
                    

                </div>

                

            </section>


            <section id="general_asset">

                <div id="general_asset_header">
                    <h2> expired asset</h2>

                    <button onClick={() => dueItem() }>view expired market asset</button>

                    {loadingexpiredItem ? <p>loading expired marking......</p> : ''}

                    

                </div>

                <div className="contract_asset_container">

                    {signIn ? 
                        <p className="error"> connect your metamask wallet on binance test network to check if you have any expired market product please....</p> : 

                        noexpiredItem 
                        ? 
                            <div className="no_expired_product">
                                <p>no expired market products please...</p> 
                            </div>
                        :

                        
                            recieveItems.map((item) =>{

                                return(
                                    <GeneralAsset key={item.token_id} expiredItem={item}></GeneralAsset>
                                )
                            })
                    

                    }

                   

                   
                </div>

            </section>

            
            

        </section>
        <Footer></Footer>

        </>
    )
}