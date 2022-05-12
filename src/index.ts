import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}
4;
export class MetamaskLogin {
    private static _connected: boolean = false;
    private static _provider: ethers.providers.Web3Provider;
    private static _wallet: string;

    public static async connectWallet() {
        if (!window.ethereum?.isMetaMask) {
            throw new Error("Metamask extension not installed");
        }

        window.ethereum.on("accountsChanged", (accounts) => {
            this._wallet = accounts[0];
        });

        this._provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await this._provider.send("eth_requestAccounts", []);

        this._wallet = accounts[0];
        this._connected = true;
    }

    public static async signMessage(message: string) {
        if (!this._connected) {
            throw new Error("Wallet not connected");
        }
        const signature: string = await this._provider.send("personal_sign", [this._wallet, message]);
        return signature;
    }

    public static verifySignature(message: string, wallet: string, sig: string): boolean {
        const recovered = ethers.utils.verifyMessage(Buffer.from(message), sig);
        return wallet.toLowerCase() === recovered.toLowerCase();
    }

    public static get provider() {
        return this._provider;
    }

    public static get wallet() {
        return this._wallet;
    }

    public static get isWalletConnected() {
        return this._connected;
    }
}
