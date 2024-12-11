from typing import Literal

from algopy import (
    ARC4Contract,
    BoxMap,
    Global,
    OnCompleteAction,
    Txn,
    UInt64,
    arc4,
    gtxn,
    itxn,
    subroutine,
    urange,
)
from algopy.arc4 import Byte, DynamicArray, StaticArray, Struct, abimethod, baremethod
from lib_pcg import pcg16_init, pcg16_random

# pylint: disable=unexpected-keyword-arg


class AssetKey(Struct):
    id: arc4.UInt64


class AssetValues(Struct):
    asa_id: arc4.UInt64
    prob: arc4.UInt64


class GachaContract(ARC4Contract):

    def __init__(self) -> None:
        self.raffle_price = UInt64(1000000)
        self.assets_count = UInt64(0)
        self.assets_list = BoxMap(AssetKey, AssetValues)

    @subroutine
    def get_box_mbr(self) -> UInt64:
        """
        Subroutine that returns the increment of the MBR (minimum balance required)
        for adding a new asset.

        Returns:
            UInt64: MBR required
        """
        # 2.500 + 400 * (# box Bytes = prefix + key bytes + value bytes)
        return (
            100_000
            + 2_500
            + (
                self.assets_list.key_prefix.length
                + 8  # id
                + 8  # asa id
                + 8  # asa probability
            )
            * 400
        )

    @abimethod(readonly=True)
    def get_mbr(self) -> UInt64:
        """
        Public method to get the increment of the MBR (minimum balance required)
        for adding a new asset.

        Returns:
            UInt64: MBR required
        """
        return self.get_box_mbr()

    @abimethod()
    def add_new_asset(
        self,
        asa_id: arc4.UInt64,
        asa_prob: arc4.UInt64,
        mbr_pay: gtxn.PaymentTransaction,
    ) -> None:
        """
        Adds a new asset to the Smart Contract
        Args:
            asa_id (arc4.UInt64): The id of the ASA
            asa_prob (arc4.UInt64): The probability to get that ASA (between 1 and 1000)
            mbr_pay (gtxn.PaymentTransaction): The payment of MBR
        Returns:
            UInt64: MBR required
        """
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"
        assert mbr_pay.sender == Txn.sender, "Payment must come from same addres"
        assert mbr_pay.receiver == Global.current_application_address
        assert mbr_pay.amount == self.get_box_mbr()

        box_key = AssetKey(id=arc4.UInt64(self.assets_count))

        self.assets_list[box_key] = AssetValues(asa_id=asa_id, prob=asa_prob)

        itxn.AssetTransfer(
            xfer_asset=asa_id.native,
            asset_receiver=Global.current_application_address,
            asset_amount=0,
        ).submit()

        self.assets_count = self.assets_count + 1

    @abimethod()
    def withdraw_asset(self, asa_id: UInt64, asa_amt: UInt64) -> None:
        """
        Withdraw a given amount, from the specified ASA
        Args:
            asa_id (UInt64): The id of the ASA
            asa_amt (UInt64): The amount to withdraw
        """
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"

        itxn.AssetTransfer(
            xfer_asset=asa_id,
            asset_receiver=Txn.sender,
            asset_amount=asa_amt,
        ).submit()

    @abimethod()
    def withdraw_algos(self, amt: UInt64) -> None:
        """
        Withdraw a given amount of Algos from the Smart Contract account
        Args:
            amt (UInt64): The amount of Algos to withdraw
        """
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"

        itxn.Payment(
            sender=Global.current_application_address, receiver=Txn.sender, amount=amt
        ).submit()

    @abimethod()
    def delete_asset_from_box(self, box_id: arc4.UInt64) -> None:
        """
        Delete a given ASA from the box storage
        Args:
            asa_id (UInt64): The id of the ASA
            asa_amt (UInt64): The amount to withdraw
        """
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"

        box_key = AssetKey(id=box_id)
        asa = self.assets_list[box_key].asa_id
        itxn.AssetTransfer(
            xfer_asset=asa.native,
            asset_receiver=Global.current_application_address,
            asset_close_to=Global.current_application_address,
            asset_amount=0,
        ).submit()
        del self.assets_list[box_key]
        self.assets_count = self.assets_count - 1

    @abimethod()
    def update_asset_probability(
        self, box_id: arc4.UInt64, asa_prob: arc4.UInt64
    ) -> None:
        """
        Update the probability of an specific asset
        Args:
            box_id (arc4.UInt64): The id of the box where the asset is located
            asa_prob (arc4.UInt64): The NEW probability to set to the ASA (between 1 and 1000)
        """
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"
        box_key = AssetKey(id=box_id)
        asa = self.assets_list[box_key].asa_id
        self.assets_list[box_key] = AssetValues(asa_id=asa, prob=asa_prob)

    @abimethod()
    def get_asset_info(self, box_id: arc4.UInt64) -> tuple[UInt64, UInt64]:
        """
        Get the information of an ASA on the boxes list,
        Args:
            box_id (arc4.UInt64): The id of the Box
        Returns:
            (UInt64, UInt64): ASA id, ASA probability
        """
        box_key = AssetKey(id=box_id)
        return (
            self.assets_list[box_key].asa_id.native,
            self.assets_list[box_key].prob.native,
        )

    @abimethod()
    def update_raffle_price(self, price: UInt64) -> None:
        """
        Update the price of the raffle
        Args:
            price (UInt64): The new price
        """
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"
        assert price >= UInt64(1000000), "Must be at least 1 $Algo"
        self.raffle_price = price

    @abimethod(allow_actions=[OnCompleteAction.NoOp])
    def raffle_helper(self) -> None:
        """Helper function"""

    @abimethod()
    def raffle(
        self, pay: gtxn.PaymentTransaction, seed: StaticArray[Byte, Literal[8]]
    ) -> UInt64:
        """
        Triggers the draw
        Args:
            pay (gtxn.PaymentTransaction): Payment to draw
            seed (StaticArray[Byte, Literal[8]): seed for the random (8 chars)
        Returns:
            UInt64: The id of the won ASA
        """
        assert pay.receiver == Global.creator_address
        assert pay.amount >= self.raffle_price

        state = pcg16_init(seed.bytes)
        state, seq = pcg16_random(state, UInt64(1), UInt64(1001), UInt64(1))
        rand = seq.pop()
        acc = UInt64(0)
        for i in urange(self.assets_count):
            box_key = AssetKey(id=arc4.UInt64(i))
            acc = self.assets_list[box_key].prob.native + acc
            if rand.native <= acc:
                itxn.AssetTransfer(
                    xfer_asset=self.assets_list[box_key].asa_id.native,
                    asset_receiver=Txn.sender,
                    asset_amount=1,
                ).submit()
                return self.assets_list[box_key].asa_id.native
        return UInt64(0)

    @abimethod()
    def raffle2(self, pay: gtxn.PaymentTransaction, seed: DynamicArray[Byte]) -> UInt64:
        """
        Triggers the draw
        Args:
            pay (gtxn.PaymentTransaction): Payment to draw
            seed (DynamicArray[Byte]): seed for the random (chars)
        Returns:
            UInt64: The id of the won ASA
        """
        assert pay.receiver == Global.creator_address
        assert pay.amount >= self.raffle_price

        seed.append(Byte(Global.latest_timestamp))
        seed.append(Byte(Global.round))

        state = pcg16_init(seed.bytes)
        state, seq = pcg16_random(state, UInt64(1), UInt64(1001), UInt64(1))
        rand = seq.pop()
        acc = UInt64(0)
        for i in urange(self.assets_count):
            box_key = AssetKey(id=arc4.UInt64(i))
            acc = self.assets_list[box_key].prob.native + acc
            if rand.native <= acc:
                itxn.AssetTransfer(
                    xfer_asset=self.assets_list[box_key].asa_id.native,
                    asset_receiver=Txn.sender,
                    asset_amount=1,
                ).submit()
                return self.assets_list[box_key].asa_id.native
        return UInt64(0)

        # @abimethod()
        # def random(self, seed: StaticArray[Byte, Literal[8]]) -> UInt64:
        #     state = pcg16_init(seed.bytes)
        #     state, seq = pcg16_random(state, UInt64(0), UInt64(1001), UInt64(1))
        #     return seq.pop().native

        # @abimethod()
        # def random2(self, seed: DynamicArray[Byte]) -> UInt64:
        # seed.append(Byte(Global.latest_timestamp))
        # seed.append(Byte(Global.round))
        # state = pcg16_init(seed.bytes)
        # state, seq = pcg16_random(state, UInt64(1), UInt64(1001), UInt64(1))
        # return seq.pop().native

    @baremethod(allow_actions=[OnCompleteAction.UpdateApplication])
    def update(self) -> None:
        """Only creator can UPDATE the Smart Contract"""
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"

    @baremethod(allow_actions=[OnCompleteAction.DeleteApplication])
    def delete(self) -> None:
        """Only creator can DELETE the Smart Contract"""
        assert Txn.sender == Global.creator_address, "Must be the creator wallet"
