import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const tallyDefs = loadSync("./voting.proto");
const tallyProto = loadPackageDefinition(tallyDefs);

const client = new tallyProto.VotingService(
  "127.0.0.1:5052",
  credentials.createInsecure()
);

const getResults = () => {
  client.CountVotes({}, (err, response) => {
    if (err) {
      console.log("Erro ao obter resultados:", err);
      return;
    }

    const candidates = response.candidates;
    candidates.forEach((candidate) => {
      console.log(
        `\nCandidato: ${candidate.name} \nQtd. de Votos: ${candidate.votes}`
      );
    });
  });
};

getResults();
