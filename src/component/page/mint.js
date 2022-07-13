import React, {useState} from "react";
import { Footer } from "./../footer";


import  "./../../css/mint.css";

import { useMoralisFile, useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import Moralis from "moralis";


export let Mint = () => {

    let [image, setImage] = useState('');
    let [name, setName] = useState('');
    let [description, setDescription] = useState('')

    let [mint, setMint] = useState(false)

    const {error, isUploading, moralisFile, saveFile} = useMoralisFile();
    const { data, error:contractErr, fetch, isFetching, isLoading,  } = useWeb3ExecuteFunction();
    const { isAuthenticated } = useMoralis();




    // function to mint nft :::::::::::::

    let mintNft = async () => {

        

        let file = image;
        let nftName = name;
        let nftDescription = description;

        if (!file || !nftName || !nftDescription) {

            alert('please fill all the inputs...');
            
        }else{

            setMint(true);

            let fileName = file.name;
            //console.log(fileName);

            if (!isAuthenticated) {


                alert('connect your wallet please....');
                
            }else{

            

                try {



                    let saveimage = await saveFile(fileName, file, { saveIPFS: true });
                    //console.log(saveimage);

                    let ipfsImage = saveimage._ipfs;

                    let metadata = {
                        name: nftName,
                        description: nftDescription,
                        image : ipfsImage
                    };

                    //console.log(JSON.stringify(metadata));

                    let saveMetadata = await saveFile('metadata.json', {base64: btoa(JSON.stringify(metadata))}, {type: 'base64',  saveIPFS: true });

                    //console.log(saveMetadata);

                    let nftMetadata = saveMetadata._ipfs;

                    //console.log(nftMetadata);

                    await  Moralis.enableWeb3();

                   


                    let option = {
                        abi: [
                            {
                                "inputs": [
                                {
                                    "internalType": "string",
                                    "name": "_url",
                                    "type": "string"
                                }
                                ],
                                "name": "mint",
                                "outputs": [],
                                "stateMutability": "payable",
                                "type": "function",
                                "payable": true
                            }
                        ],
                        //contractAddress: '0x2161EB08f1f16c1E68fa415A400cB2F3DCb37077',
                        contractAddress: '0xDaF1d8B4DA46efA8578671c21f640Df4f42f1A5C',
                        functionName: "mint",
                        params: {
                        _url : nftMetadata
                        },
            
                        msgValue: Moralis.Units.ETH("0.000002")
                    }


                    await fetch({
                        params: option,
            
                        onSuccess: (succ) => {
                        
                            alert('NFT successfully minted');     
                        },
            
                        onError: (erroe) => {
                            alert('NFT fail to mint')
                            
                        }
                    })


                    setImage('');
                    setName('');
                    setDescription('');


                    
                }
                catch(err) {
                    alert(err)
                }

            }
            
      

            setMint(false);

            

           
       
        }
    }

    return(
        <>
        <section id="mint">
            
            <div>

                <div className="mint_header">
                    <h2>get your own NFT today</h2>
                </div>

                <div className="input">
                    <input type="text" placeholder="name" className="name" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>

                <div className="input">
                    <input type="text"placeholder="decription" className="name" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>

                <div className="input_file">
                    <input type="file" className="file" onChange={(e) => setImage(e.target.files[0])}/>
                    <button type="button">{!image ? 'choose image' : image.name}</button>
                </div>

                <div className="mint_btn">
                <button type="button" onClick={() => mintNft() }>{mint ? 'minting...' : 'mint'}</button>
                </div>



            </div>

        </section>
        <Footer></Footer>

        </>
    )
}