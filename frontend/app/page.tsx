"use client";

import TransgateConnect from "@zkpass/transgate-js-sdk";
import Image from "next/image";
import Web3 from "web3";

export default function Home() {
  const verify = async () => {
    try {
      // The appid of the project created in dev center
      const appid = "71a48284-726b-4264-bf0e-69658b25a961";

      // Create the connector instance
      const connector = new TransgateConnect(appid);

      // Check if the TransGate extension is installed
      // If it returns false, please prompt to install it from chrome web store
      const isAvailable = await connector.isTransgateAvailable();

      if (isAvailable) {
        // The schema id of the project
        const schemaId = "f2f023d3e56f4fb7a039daef8aab8ca8";

        // Launch the process of verification
        // This method can be invoked in a loop when dealing with multiple schemas
        const res = await connector.launch(schemaId);
        console.log("res", res);

        const web3 = new Web3();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { taskId, validatorAddress, allocatorSignature } = res as any;
        const taskIdHex = Web3.utils.stringToHex(taskId);
        const schemaIdHex = Web3.utils.stringToHex(schemaId);
        // verifiy the res onchain/offchain based on the requirement

        const encodeParams = web3.eth.abi.encodeParameters(
          ["bytes32", "bytes32", "address"],
          [taskIdHex, schemaIdHex, validatorAddress]
        );
        const paramsHash = Web3.utils.soliditySha3(encodeParams);
        if (!paramsHash) return;
        const signedAllocatorAddress = web3.eth.accounts.recover(
          paramsHash,
          allocatorSignature
        );
        console.log(
          signedAllocatorAddress ===
            "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d"
        );
        if (
          signedAllocatorAddress ===
          "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d"
        ) {
          alert("Verification successful");
        }
        return (
          signedAllocatorAddress ===
          "0x19a567b3b212a5b35bA0E3B600FbEd5c2eE9083d"
        );
      } else {
        console.log("Please install TransGate");
      }
    } catch (error) {
      console.log("transgate error", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            onClick={() => verify()}
          >
            Verify now
          </button>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
