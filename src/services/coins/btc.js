import _ from "lodash";
import bitcoin from "bitcoinjs-lib";
import coinSelect from "coinselect";
import bip39 from "bip39";

import TransactionService from "../transactionService";

class BtcServices {
  getKeyPair(mnemonic, networks) {
    const hdNode = bitcoin.HDNode.fromSeedHex(
      bip39.mnemonicToSeedHex(mnemonic),
      networks.bitcoinjsNetwork
    );

    return hdNode.derivePath(networks.derivePath + "/0");
  }

  getBtcAddress(data) {
    try {
      const hdNode = bitcoin.HDNode.fromSeedBuffer(
        bip39.mnemonicToSeed(data.seed),
        data.network.bitcoinjsNetwork
      );
      let keyPair = hdNode.derivePath(data.network.derivePath + "/0");
      let address = keyPair.getAddress();
      return address;
    } catch (error) {
      return "error";
    }
  }

  async createTransaction(data) {
    try {
      let usdt = false;
      let broadcastResult = undefined;
      let txb = undefined;
      let txHex = undefined;

      if (data.coin === "usdt") usdt = true;

      const transService = new TransactionService();

      const utxos = await transService.utxo(
        data.fromAddress,
        usdt ? "btc" : data.coin,
        data.token
      );

      const targets = [
        {
          address: data.toAddress,
          value: data.amount
        }
      ];

      if (data.lunesWallet.address && data.feeLunes) {
        targets.push({
          address: data.lunesWallet.address,
          value: data.feeLunes
        });
      }

      let { inputs, outputs } = coinSelect(
        utxos,
        targets,
        data.feePerByte <= 2 ? 3 : data.feePerByte
      );

      let keyPair = this.getKeyPair(data.seed, data.network);

      let tx = usdt
        ? await this.usdtTransaction(data, keyPair)
        : new bitcoin.TransactionBuilder(data.network.bitcoinjsNetwork);

      if (usdt) {
        txb = bitcoin.TransactionBuilder.fromTransaction(tx);
        for (let i = 0; i < tx.ins.length; i++) {
          txb.sign(i, keyPair);
        }
        txHex = txb.build().toHex();
      } else {
        outputs.forEach(output => {
          if (!output.address) {
            output.address = data.fromAddress;
          }

          tx.addOutput(output.address, output.value);
        });

        inputs.forEach(input => {
          tx.addInput(input.txId, input.vout);
        });

        tx = this.sign(tx, keyPair);
        txHex = tx.build().toHex();
      }

      if (usdt) {
        broadcastResult = await transService.pushTx(txHex);
        return broadcastResult.tx;
      }

      broadcastResult = await transService.broadcast(
        txHex,
        usdt ? "btc" : data.coin,
        data.token
      );

      return broadcastResult.data.data.txId;
    } catch (error) {
      console.warn(error);
      return "error";
    }
  }

  sign(tx, keyPair) {
    _.times(tx.inputs.length, i => tx.sign(i, keyPair));
    return tx;
  }

  async usdtTransaction(data, keyPair) {
    try {
      let pubKey = keyPair.getPublicKeyBuffer().toString("hex");
      let params = new URLSearchParams();

      params.append("transaction_version", 1);
      params.append("currency_identifier", 31);
      params.append("fee", data.fee);
      params.append("testnet", data.network.testnet);
      params.append("pubkey", pubKey);
      params.append("amount_to_transfer", data.amount);
      params.append("transaction_from", data.fromAddress);
      params.append("transaction_to", data.toAddress);

      let transService = new TransactionService();
      let response = await transService.getUnsigned(params);
      let tx = bitcoin.Transaction.fromHex(response.unsignedhex);

      return tx;
    } catch (error) {
      console.warn(error);
      return error;
    }
  }
}

export default BtcServices;
