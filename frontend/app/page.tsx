"use client";
import { useState } from "react";
import styles from "./page.module.css";
import TransgateConnect from "@zkpass/transgate-js-sdk";
import styled from "styled-components";
import JSONPretty from "react-json-pretty";
import { ethers } from "ethers";
import zkNFTABI from "./zkNFTABI.json";

const FormGrid = styled.div`
  display: grid;
  grid-gap: 36px;
  grid-template-columns: 800px;
  margin: 3rem auto;
`;

const FromContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 1rem;
`;

const Label = styled.div`
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  display: block;
  background-color: #ffffff;
  border-radius: 5px;
  height: 35px;
  line-height: 35px;
  width: 100%;
  padding: 0 18px;
  outline: none;
  color: #000000;
`;

const Button = styled.button<{ disabled?: boolean }>`
  position: relative;
  display: block;
  min-width: 120px;
  height: 35px;
  line-height: 35px;
  padding: 0 18px;
  text-align: center;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  background: #c5ff4a;
  color: var(--color-black);
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  &:active {
    border: 0.5px solid #898989;
    color: #0a0a0aab;
  }
`;

const RightContainer = styled.div`
  grid-column: 2 / 3;
`;

const Title = styled.h2`
  color: #ffffff;
  text-align: center;
`;

export default function Home() {
  const [appid1, setAppid1] = useState<string>(
    "e23d62ff-adf8-4ed6-9447-381d4dcffae8"
  );
  //   const appid = "71a48284-726b-4264-bf0e-69658b25a961";
  //   const schemaId = "f2f023d3e56f4fb7a039daef8aab8ca8";

  const [value1, setValue1] = useState<string>(
    "fc126b2b1f734989b415c901d1021177"
  );
  const [result, setResult] = useState<any>();

  const start = async (schemaId: string, appid: string) => {
    try {
      const connector = new TransgateConnect(appid);
      const isAvailable = await connector.isTransgateAvailable();
      if (!isAvailable) {
        return alert("Please install zkPass TransGate");
      }
      //@ts-ignore
      if (window.ethereum == null) {
        return alert("MetaMask not installed");
      }
      //@ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      //get your ethereum address
      const account = await signer.getAddress();

      const res: any = await connector.launch(schemaId, account);
      setResult(res);

      //Sepolia contract address
      //You can add from https://chainlist.org/?search=11155111&testnets=true
      // const contractAddress = "0x2c1726130AA1E021D69Cf006467bD77953bEa724"; //全通し
      const contractAddress = "0x6390AA9B19D4d2BbDa745C03DECA0A5775f9B0E2";

      const taskId = ethers.hexlify(ethers.toUtf8Bytes(res.taskId)); // to hex
      schemaId = ethers.hexlify(ethers.toUtf8Bytes(schemaId)); // to hex

      const chainParams = {
        taskId,
        schemaId,
        uHash: res.uHash,
        recipient: account,
        publicFieldsHash: res.publicFieldsHash,
        validator: res.validatorAddress,
        allocatorSignature: res.allocatorSignature,
        validatorSignature: res.validatorSignature,
      };
      console.log("chainParams", chainParams);

      // const contract = new ethers.Contract(
      //   contractAddress,
      //   AttestationABI,
      //   provider
      // );
      // const data = contract.interface.encodeFunctionData("attest", [
      //   chainParams,
      // ]);

      const contract = new ethers.Contract(contractAddress, zkNFTABI, provider);
      const data = contract.interface.encodeFunctionData("mintWithProof", [
        chainParams,
      ]);

      const transaction = {
        to: contractAddress,
        from: account,
        value: 0,
        data,
      };
      console.log("transaction", transaction);
      const tx = await signer?.sendTransaction(transaction);
      console.log("transaction hash====>", tx.hash);
      alert("Transaction sent successfully!");
    } catch (err) {
      alert(JSON.stringify(err));
      console.log("error", err);
    }
  };
  return (
    <main className={styles.main}>
      <Title>zkPass Transgate JS-SDK Demo(send to evm chain)</Title>
      <FormGrid>
        <FromContainer>
          <FormItem>
            <Label>Appid:</Label>
            <Input
              value={appid1}
              onInput={(e) => setAppid1(e.target.value?.trim())}
            />
          </FormItem>
          <FormItem>
            <Label>Schema Id:</Label>
            <Input
              value={value1}
              onInput={(e) => setValue1(e.target.value?.trim())}
            />
          </FormItem>
          <FormItem>
            <RightContainer>
              <Button onClick={() => start(value1, appid1)}>Run</Button>
            </RightContainer>
          </FormItem>
          <FormItem>
            {result && (
              <JSONPretty
                themeClassName="custom-json-pretty"
                id="json-pretty"
                data={result}
              ></JSONPretty>
            )}
          </FormItem>
        </FromContainer>
      </FormGrid>
    </main>
  );
}
