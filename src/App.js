import "./App.css";
import * as React from "react";
import { DisplayTable } from "./DisplayTable";
import { client } from "./client";
import { ApolloProvider } from "@apollo/client";

function App() {
  return (
    <ApolloProvider client={client}>
      <DisplayTable
        headers={["ID", "Name", "Status", "Species", "Gender"]}
        templateColumns={`2fr repeat(4, 5fr) 1fr`}
      />
    </ApolloProvider>
  );
}

export default App;
