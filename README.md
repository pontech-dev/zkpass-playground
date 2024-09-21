# zkPass動かしてみた

目的: zkPassのzkproofをオンチェーンでverifyし、verifyを通過した場合のみmintできるNFTを作ってみる。

- [https://dev.zkpass.org/](https://dev.zkpass.org/)からプロジェクトとスキーマを作成
    - Add Schemaから既存のスキーマを選択するか、Add Custom Schemaから自作のスキーマを作成
    - 自作スキーマの作成は[このドキュメント](https://zkpass.gitbook.io/zkpass/developer-guides/extension-js-sdk/schema/quick-start-for-creating-custom-schema)を参考に
    - AppIdとSchemaIdを保存

## Ethrerum

### コントラクトデプロイ

- コントラクトを修正 (ProofVerifiedNFT.sol)
``` 
function mintWithProof(Proof calldata _proof) public returns (uint256) {
        require(_proof.schemaId == "74cddfcc606c4b9693b7860ebbdf127b", "Different shemaId");
        require(verify(_proof), "Invalid proof");
}
```
- schemaIdを自分で作成したものに。ここがないとどのzkproofも通過してしまう。

- contractsフォルダの.envにPRIVATE_KEYを設定（要gas代）

```
npx hardhat run scripts/deploy.nft.js --network sepolia
```

### フロントエンド

- frontend/app/evm-contractのpage.tsxを編集
- contractAddressをデプロイしたものに変更
- 立ち上げたフロントエンドで、appIdとschemaIdを入力して、Runボタンを実行
- Metamaskが立ち上がるので署名するとNFTがmintできる



## Solana