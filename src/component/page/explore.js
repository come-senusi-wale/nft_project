import React, {useEffect, useState} from "react";

import  "./../../css/explore.css";
import explore from "./../../image/nft.png";

import { ExploreProduct } from "./../exploreProduct";
import { Footer } from "./../footer";


import { useMoralisWeb3Api,useWeb3ExecuteFunction, useMoralis } from "react-moralis"
import Moralis from "moralis";


export let Explore = () => {

    const { data, error:contractErr, fetch, isFetching, isLoading,  } = useWeb3ExecuteFunction();
    const { isAuthenticated } = useMoralis();

    let [items, setItems] = useState([]);

    let [loading, setLoading] = useState(false);


    let nftCompanyProduct = async () => {

        setLoading(true)

        await Moralis.enableWeb3();

        //await Moralis.authenticate();


        
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

        

        let counts = await fetch({
            params: option,

            onSuccess: (succ) => {
            
                
            },

            onError: (erroe) => {
                //alert('smart contract fail to approve')
                alert(erroe);
                //console.log(erroe);
                
            }
        })


        let count = parseInt(counts._hex, 16);



        // for fetching market product :::::::::::::

        let arr = []

        for (let i = 0; i < count; i++) {
            
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

            


            await fetch({
                params: optionTwo,

                onSuccess: (succ) => {
                
                   // alert('you successfully approved the smart contract');   

                    let itemId = parseInt(succ[0]._hex, 16);
                    let token_id = parseInt(succ[2]._hex, 16);
                    let time = parseInt(succ[5]._hex, 16);
                    let amount = parseInt(succ[3]._hex, 16);
                    let sold = succ[7];

                    

                    let obj = {itemId, token_id, time, amount, sold};

                    arr.push(obj);
                    //console.log(arr);
                    
                    
                    
                },

                onError: (erroe) => {
                    alert(erroe)
                    //console.log(erroe);
                    
                }
            })

            //console.log(arr);
        
        }

        let products = arr.filter((data) => {
            return (data.time > new Date().getTime() && data.sold == false);
        })

        //console.log(products);

        setItems(products);

        setLoading(false);

    }

    useEffect(() => {

        //nftCompanyProduct();

    }, [])

    return(<>
        <section id="explore">

            <div id="explore_decriptoon">

                <div id="eplore_text">

                    <h2>Create, Buy, <br />Sell, Swap and Farm NFTs</h2>
                    <p>Grow your NFT brand with zero technical expertise, creator & enterprise friendly features, complete customisation, and tons of integrations.</p>

                    <div className="button_explore">
                        <a href="#" className="buy_now">buy now</a>
                        <a href="#" className="learn_more">learn more</a>
                    </div>

                </div>

                <div id="explore_logo">
                    <div id="exlore_image">
                        <img src={explore} alt=""  />
                    </div>
                </div>


            </div>

            <section id="explore_project">

                <div id="product_title">
                    <p>collections</p>
                    <h3>hot products</h3>

                    <button onClick={() => nftCompanyProduct()}>view collection</button>

                    {loading ?

                    <div className="please">
                        <p>loading collections...</p>
                        <h3>please wait...</h3>
                    </div>
                    
                    : ''}

                    
                </div>


                <section id="product_container">

                    {
                        items.map((item) => {

                            return(
                                <ExploreProduct key={item.itemId} product={item}></ExploreProduct>

                            )
                            
                        })
                    }

                    
                    
                    

                </section>

            </section>
            
            
        </section>
        <Footer></Footer>

        </>
    )
    
}