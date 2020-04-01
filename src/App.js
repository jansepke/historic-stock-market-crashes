import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import React, { useState } from "react";
import { calculateTableData } from "./calculator";
import Form from "./form";
import Table from "./table";

export default () => {
  const [tableData, setTableData] = useState([]);

  const onFormChange = async ({ index, minDrawdown }) => {
    let data = await loadIndexData(index);

    const newTableData = calculateTableData(data, minDrawdown);

    setTableData(newTableData);
  };

  const loadIndexData = async index => {
    if (index === "world") {
      return import(`../data/world.json`);
    }
    if (index === "acwi") {
      return import(`../data/acwi.json`);
    }
    if (index === "acwi-imi") {
      return import(`../data/acwi-imi.json`);
    }
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Form onChange={onFormChange}></Form>
        </Grid>
        <Grid item xs={12}>
          <Table tableData={tableData}></Table>{" "}
        </Grid>
      </Grid>
    </Container>
  );
};
