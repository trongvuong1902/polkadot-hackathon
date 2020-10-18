import React, { useRef, useState } from "react";
import { Table, Grid, Button } from "semantic-ui-react";
import { useSubstrate } from "./substrate-lib";

export default function SearchBlock(props) {
  const { api, keyring } = useSubstrate();
  const [blockInfo, setBlockInfo] = useState({});
  const inputRef = useRef(null);

  const handleSearch = async () => {
    const searchValue = inputRef.current.value;

    if (!searchValue) return;
    let block = null;
    try {
      if (searchValue.indexOf('0x') >= 0)
        block = await api.rpc.chain.getBlock(searchValue);
      else if (Number.isInteger(Number(searchValue))) {
        const hash = await api.rpc.chain.getBlockHash(searchValue);
        block = await api.rpc.chain.getBlock(hash);
      }
    } catch (error) {
      console.log(error);
      block = null;
    }
    if (block)
      setBlockInfo([
        { name: "Number", value: block.block.header.number.toNumber() },
        { name: "Hash", value: block.block.header.hash.toHex() },
        { name: "Parent Hash", value: block.block.header.parentHash.toHex() },
        { name: "State Root", value: block.block.header.stateRoot.toHuman() },
        {
          name: "Extrinsics Root",
          value: block.block.header.extrinsicsRoot.toHuman(),
        },
      ]);
    else
      setBlockInfo([
        { name: "Number", value: "INVALID BLOCK" },
        { name: "Hash", value: "INVALID BLOCK" },
        { name: "Parent Hash", value: "INVALID BLOCK" },
        { name: "State Root", value: "INVALID BLOCK" },
        {
          name: "Extrinsics Root",
          value: "INVALID BLOCK"
        },
      ]);
  };

  return (
    <Grid.Column>
      <h1>Search for Block Info</h1>
      <input ref={inputRef} type="text" />
      <button onClick={handleSearch}>Search</button>
      {blockInfo && (
        <Table celled striped size="small">
          <Table.Body>
            {blockInfo && blockInfo[0] ? (
              blockInfo.map((info) => (
                <Table.Row key={info.name}>
                  <Table.Cell width={3} textAlign="right">
                    {info.name}
                  </Table.Cell>
                  <Table.Cell width={3}>{info.value}</Table.Cell>
                </Table.Row>
              ))
            ) : (
                <Table.Row></Table.Row>
              )}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  );
}