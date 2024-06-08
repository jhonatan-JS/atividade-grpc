import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const tallyDefs = loadSync("./voting.proto");
const tallyProto = loadPackageDefinition(tallyDefs);

const client = new tallyProto.VotingService(
  "127.0.0.1:5052",
  credentials.createInsecure()
);

const getResults = () => {
  client.GetResults({}, (err, response) => {
    console.log("Resultado da apuração:", response);
  });
};

getResults();
