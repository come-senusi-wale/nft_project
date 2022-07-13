import React, {useEffect, useState} from "react";
import { FaRegHeart, FaEllipsisV } from "react-icons/fa";
import { Link } from "react-router-dom";


import logo  from "./../image/logo.jpg";

import { useMoralisWeb3Api,useWeb3ExecuteFunction, useMoralis } from "react-moralis"
import Moralis from "moralis";


export let ExploreProduct = ({product}) => {

    let [name, setName] = useState('');
    let [image, setImage] = useState('');
    let [description, setDescription] = useState('');

    let [amount, setAmount] = useState(0);

    let [day, setDay] = useState(0);
    let [hour, setHour] = useState(0);
    let [minute, setMinute] = useState(0);
    let [second, setSecond] = useState(0);

    let [buying, setBuying] = useState(false);

    const { isAuthenticated } = useMoralis();

    const { fetch  } = useWeb3ExecuteFunction();

    const Web3Api = useMoralisWeb3Api();

    let contractNFT = async () => {

        const options = {
            address: "0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C",
            chain: "bsc testnet",
        };

        const NFTs = await Web3Api.token.getAllTokenIds(options);
        //console.log(NFTs);

        let results = NFTs.result;
        //console.log(results);

        //console.log(product.token_id);

        let correct_product = results.filter((result) => {
            return (result.token_id == product.token_id);
        });

        //console.log(JSON.parse(correct_product[0].metadata));

        let metadata = JSON.parse(correct_product[0].metadata);

        setName(metadata.name);
        setImage(metadata.image);
        setDescription(metadata.description)
        
    }

    let time = () => {

        let time = product.time;
        //console.log(time);

        let timeRemain = time - new Date().getTime();
        //console.log(timeRemain);

        let oneDay = 24 * 60 * 60 * 1000;
        let oneHour = 60 * 60 * 1000;
        let oneminutes = 60 * 1000;

        let days = timeRemain/oneDay;
        //console.log(days)
        days = Math.floor(days);
        //console.log(days);

        let hours = Math.floor((timeRemain % oneDay)/oneHour);
        //console.log(hours);

        let minutes = Math.floor((timeRemain % oneHour)/oneminutes);
        //console.log(minutes);

        let seconds = Math.floor((timeRemain % oneminutes)/1000);
        //console.log(seconds);

        setDay(days);
        setHour(hours);
        setMinute(minutes);
        setSecond(seconds);

    }



    // function for buy nft form market place ::::::::::::::::::::::::::::::::::::::::::::::::::

    let buy = async (e) => {

        e.preventDefault();

        let price = e.target.getAttribute('data-amount');
        //console.log(price);
        //console.log(price.toString());

        let itemId = e.target.getAttribute('data-itemId');
      
        
        if (!isAuthenticated) {

            alert('plaest connect your metamask wallet on binance test network please.....');

        }else{

            setBuying(true)

            await  Moralis.enableWeb3();

            let optionTwo = {
                abi: [
                    {
                        "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_itemId",
                            "type": "uint256"
                        }
                        ],
                        "name": "purchase",
                        "outputs": [],
                        "stateMutability": "payable",
                        "type": "function",
                        "payable": true
                    }
                ],

                contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',

                functionName: "purchase",

                params: {
                    
                    _itemId: itemId
                },

                //msgValue:  Moralis.Units.ETH(price)
                msgValue:  Moralis.Units.ETH(price.toString())
            }


            await fetch({
                params: optionTwo,

                onSuccess: (succ) => {
                
                    alert('you successfully buy this NFT'); 
                    //console.log(succ);    
                },

                onError: (erroe) => {
                    alert(erroe.data.message);
                    //console.log(erroe);
                    
                }
            })

            setBuying(false);
            window.location.reload();
        }   

    }

    useEffect(() => {

        contractNFT();

        let ownerAmount = (product.amount) + ((product.amount)/10)

        let fullPrice = Moralis.Units.FromWei(ownerAmount.toString())

       

        setAmount(fullPrice);

        

    }, []);

    useEffect(() => {
        let interval = setInterval(time, 1000);

    }, [])

    return(

        <div className="product_container">

            <div className="product_header">
                <p className="name">wale</p>
                <p className="pointer"><FaEllipsisV onClick={() => contractNFT()}></FaEllipsisV></p>
            </div>

            <div className="img_container">

                <div className="img">
                    <img src={image} alt=""  />
                </div>

                <span className="product_time">

                    <div>
                        <p>{day}</p>
                        <span>days</span>
                    </div>

                    <div>
                        <p>{hour}</p>
                        <span>hours</span>
                    </div>

                    <div>
                        <p>{minute}</p>
                        <span>minutes</span>
                    </div>

                    <div>
                        <p>{second}</p>
                        <span>seconds</span>
                    </div>


                </span>


            </div>

            <div className="product_name">
                <h3>{name} #{product.token_id}</h3>
                <p>{description}</p>

            </div>

            <div className="product_like">
                <h3>{amount} BNB</h3>

                <div>
                    <Link className="buy_now" to='/' data-amount={amount} data-itemId={product.itemId} onClick={(e) => buy(e)}>{buying ? 'buying....' : 'buy now'} </Link>
                    <p><span><FaRegHeart></FaRegHeart></span></p>
                </div>
            </div>


            {/* right side link below :::::::::::: */}

            <div className="right_link show_right_link">

                <div className="right_link_container">
                    <ul>
                        <li>
                            <Link className="now" to='/' >Buy now</Link>
                        </li>

                        <li>
                            <a href="#">View on Opensea</a>
                        </li>

                        <li>
                            <a href="#">Refresh Metadata</a>
                        </li>

                        <li>
                            <a href="#">Share</a>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    )
}