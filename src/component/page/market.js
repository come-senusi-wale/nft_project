import React, {useEffect, useState} from "react";
import { Link, useParams } from "react-router-dom";

import  "./../../css/market.css";
import { Footer } from "./../footer";

import market from "./../../image/logo.jpg";

import { useMoralisWeb3Api,useWeb3ExecuteFunction, useMoralis } from "react-moralis"
import Moralis from "moralis";

export let Market = () => {
    const { data, error:contractErr, fetch, isFetching, isLoading,  } = useWeb3ExecuteFunction();
    const { isAuthenticated } = useMoralis();

    let [name, setName] = useState('');
    let [image, setImage] = useState('');
    let [description, setDescription] = useState('');

    let [hour, setHour] = useState('');
    let [week, setWeek] = useState('');
    let [day, setDay] = useState('');
    let [month, setMonth] = useState('');

    let [price, setPrice] = useState('')

    let [marketing, setMarketing] = useState(false);


    let {token_id} = useParams();

    const Web3Api = useMoralisWeb3Api();

    let loadSingleAsset = async () => {

        

        const serverUrl = "https://gdk00s30yy5s.usemoralis.com:2053/server";
        const appId = "k4DmY8xmLVPquxmpk2Yz0wh1Bu38nzwZ5WqJzYqt";
        Moralis.start({ serverUrl, appId });
   

        const options = {
            chain: "bsc testnet",
            
            token_address: "0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C"
        };

        const yourNFT = await Web3Api.account.getNFTsForContract(options);
        //console.log(yourNFT);

        let result = await yourNFT.result;

        let real = result.filter((data) => data.token_id == token_id);

        let metadata = JSON.parse(real[0].metadata);

        setName(metadata.name);
        setImage(metadata.image);
        setDescription(metadata.description);
        
          
    }


    useEffect(() => {

        loadSingleAsset();


    }, [])


    let market = async () => {

        let timeHour;
        let timeDay;
        let timeWeek;
        let timeMonth;

    
        if (!price) {

            alert('Enter price pleease...');
            
        }else{

            if (!hour) {

                timeHour = 0;
                
            }else{

                timeHour = (60 * 60 * 1000) * hour; 
            }



            if (!day) {
                
                timeDay = 0
            }else{

                timeDay = (1000 * 60 * 60 * 24) * day;
            }




            if (!week) {

                timeWeek = 0;
                
            }else{

                timeWeek = (1000 * 60 * 60 * 24 * 7) * week;

            }




            if (!month) {

                timeMonth = 0;
                
            }else{

                timeMonth = (1000 * 60 * 60 * 24 * 30) * month;
            }

            let date = new Date();

            let presntTime = date.getTime(); 

            let realNftTime = (timeHour + timeDay + timeWeek + timeMonth) + presntTime;
            


            if (!isAuthenticated) {

                alert('connect your metamask wallet on binance test network...')
                
            }else{

                setMarketing(true);

                await  Moralis.enableWeb3();


                let option = {
                    abi: [
                        {
                            "inputs": [
                              {
                                "internalType": "address",
                                "name": "operator",
                                "type": "address"
                              },
                              {
                                "internalType": "bool",
                                "name": "approved",
                                "type": "bool"
                              }
                            ],
                            "name": "setApprovalForAll",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                        }
                    ],

                    contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',

                    functionName: "setApprovalForAll",

                    params: {
                        operator : '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',
                        approved: true
                    },
        
                    msgValue: 0
                }


                await fetch({
                    params: option,
        
                    onSuccess: (succ) => {
                    
                        alert('you successfully approved the smart contract');     
                    },
        
                    onError: (erroe) => {
                        alert('smart contract fail to approve')
                        
                    }
                })


                // for market nft :::::::::::::::::::::::::::::::::::
                await  Moralis.enableWeb3();



                let optionTwo = {
                    abi: [
                        {
                            "inputs": [
                              {
                                "internalType": "contract IERC721",
                                "name": "_nft",
                                "type": "address"
                              },
                              {
                                "internalType": "uint256",
                                "name": "_tokenId",
                                "type": "uint256"
                              },
                              {
                                "internalType": "uint256",
                                "name": "_amount",
                                "type": "uint256"
                              },
                              {
                                "internalType": "uint256",
                                "name": "_time",
                                "type": "uint256"
                              }
                            ],
                            "name": "marketProduct",
                            "outputs": [],
                            "stateMutability": "nonpayable",
                            "type": "function"
                          }
                    ],

                    contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',

                    functionName: "marketProduct",

                    params: {
                        _nft : '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',
                        _tokenId: token_id,
                        _amount: Moralis.Units.ETH(price),
                        _time: realNftTime
                    },
        
                    msgValue: 0
                }


                await fetch({
                    params: optionTwo,
        
                    onSuccess: (succ) => {
                    
                        alert('you successfully market your NFT');     
                    },
        
                    onError: (erroe) => {
                        alert('NFT fail to market')
                        
                    }
                })

                setMarketing(false);

                window.location.assign("./../mint");



            }
            
    


        }
    }


    return(
        <>
        <section id="market">
            <div id="container">

                <div id="nft_container">

                    <div id="market_image_container">

                        <img src={image} alt=""  />
                        
                    </div>

                    <div className="name">

                        <h3>{name} #{token_id}</h3>
                        <p>{description}</p>

                    </div>

                </div>

                <div id="market_form_container">

                    <div id="price_container">
                        <label htmlFor="price">price in BNB</label>
                        <input type="number" id="price" value={price}  onChange={(e) => setPrice(e.target.value)}/>
                    </div>

                    <div id="time_container">

                        <div className="time">
                            <label htmlFor="hour">hours</label>
                            <input type="number" id="hour"  value={hour} onChange={(e) => setHour(e.target.value)}/>
                        </div>


                        <div className="time">
                            <label htmlFor="day">days</label>
                            <input type="number" id="day" value={day} onChange={(e) => setDay(e.target.value)}/>
                        </div>

                        <div className="time">
                            <label htmlFor="week">weeks</label>
                            <input type="number" id="week" value={week} onChange={(e) => setWeek(e.target.value)}/>
                        </div>

                        <div className="time">
                            <label htmlFor="month">months</label>
                            <input type="number" id="month" value={month} onChange={(e) => setMonth(e.target.value)}/>
                        </div>


                    </div>

                    <div id="market_btn">
                        <button type="button" onClick={() => market()}>{marketing ? 'marketing....' : 'market'}</button>
                    </div>


                </div>
            </div>
            

        </section>
        <Footer></Footer>

        </>
    )

}