import logging

import algokit_utils
from algosdk.v2client.algod import AlgodClient
from algosdk.v2client.indexer import IndexerClient

# mypy: disallow-untyped-calls
logger = logging.getLogger(__name__)


# define deployment behaviour based on supplied app spec
def deploy(
    algod_client: AlgodClient,
    indexer_client: IndexerClient,
    app_spec: algokit_utils.ApplicationSpecification,
    deployer: algokit_utils.Account,
) -> None:
    from smart_contracts.artifacts.gacha_contract.gacha_contract_client import (
        GachaContractClient,
    )

    app_client = GachaContractClient(
        algod_client,
        creator=deployer,
        indexer_client=indexer_client,
    )

    app_client.deploy(
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
        on_update=algokit_utils.OnUpdate.UpdateApp,
    )
    ASSETS = [720855015, 720855056, 720855066, 720855106, 720855169]
    # ASSETS = [720855015, 720855056, 720855066, 720855106]

    # sp = algod_client.suggested_params()

    # initial_txn = transaction.PaymentTxn(
    #     sender=deployer.address,
    #     sp=sp,
    #     receiver=app_client.app_address,
    #     amt=100000,
    # ) # type: ignore
    # txns = initial_txn.sign(deployer.private_key)
    # algod_client.send_transaction(txns)

    # # # response = app_client.random(seed=(1,2,3,4,5,6,7,9))
    # # # logger.info(
    # # #     f"Called random on {app_spec.contract.name} ({app_client.app_id}) "
    # # #     f"Received: {response.return_value}"
    # # # )

    # mbr = app_client.get_mbr().return_value

    # txn = transaction.PaymentTxn(
    #     sender=deployer.address,
    #     sp=sp,
    #     receiver=app_client.app_address,
    #     amt=mbr
    # ) # type: ignore

    # txn_w_signer = TransactionWithSigner(txn, deployer.signer)

    # sp.flat_fee = True
    # sp.fee = constants.MIN_TXN_FEE * 2

    # j = 0
    # for asset in ASSETS:
    #     box_key = (
    #         b"assets_list"
    #         + algosdk.encoding.encode_as_bytes(j)
    #     )

    #     add = app_client.add_new_asset(
    #         asa_id=asset,
    #         asa_prob=200,
    #         mbr_pay=txn_w_signer,
    #         transaction_parameters=algokit_utils.TransactionParameters(
    #             foreign_assets=[asset],
    #             boxes=[(app_client.app_id, box_key)],
    #             suggested_params=sp,
    #         )
    #     )
    #     logger.info(
    #         f"Called add_new_asset on {app_spec.contract.name} app id: ({app_client.app_id})"
    #         f"With txn id: {add.tx_id}"
    #     )
    #     trfer_txn = transaction.AssetTransferTxn(
    #         sender=deployer.address,
    #         sp=algod_client.suggested_params(),
    #         receiver=app_client.app_address,
    #         amt=100,
    #         index=asset,
    #     ) # type: ignore
    #     trfer_txn_signed = trfer_txn.sign(deployer.private_key)
    #     res = algod_client.send_transaction(trfer_txn_signed)
    #     logger.info(
    #         f"Sent 100 assets of {asset}, to {app_client.app_address} with txn id: {res}"
    #     )
    #     j += 1

    # txn = transaction.PaymentTxn(
    #     sender=deployer.address,
    #     sp=algod_client.suggested_params(),
    #     receiver=app_client.app_address,
    #     amt=1000000
    # ) # type: ignore

    # txn_w_signer = TransactionWithSigner(txn, deployer.signer)
    # box_key_0 = (
    #     b"assets_list"
    #     + algosdk.encoding.encode_as_bytes(0)
    # )
    # box_key_1 = (
    #     b"assets_list"
    #     + algosdk.encoding.encode_as_bytes(1)
    # )
    # box_key_2 = (
    #     b"assets_list"
    #     + algosdk.encoding.encode_as_bytes(2)
    # )
    # box_key_3 = (
    #     b"assets_list"
    #     + algosdk.encoding.encode_as_bytes(3)
    # )
    # box_key_4 = (
    #     b"assets_list"
    #     + algosdk.encoding.encode_as_bytes(4)
    # )
    # print("--------------*-")
    # print(app_client.random(seed=(1,2,3,4,5,6,7,0)).return_value)
    # res = app_client.raffle(
    #     pay=txn_w_signer,
    #     seed=(1,2,3,4,5,6,7,0),
    #     transaction_parameters=algokit_utils.TransactionParameters(
    #         foreign_assets=ASSETS,
    #         boxes=[
    #             (app_client.app_id, box_key_0),
    #             (app_client.app_id, box_key_1),
    #             (app_client.app_id, box_key_2),
    #             (app_client.app_id, box_key_3),
    #             # (app_client.app_id, box_key_4)
    #         ],
    #         suggested_params=sp,
    #     )
    # )

    # print(res.return_value)

    # txn = transaction.ApplicationDeleteTxn(
    #     sender=deployer.address,
    #     sp=algod_client.suggested_params(),
    #     index=app_client.app_id
    # )

    # id = algod_client.send_transaction(txn.sign(deployer.private_key))
    # print(id)
