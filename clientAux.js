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

    const totalVotes = response.candidates.reduce(
      (total, candidate) => total + candidate.votes,
      0
    );

    const candidates = response.candidates;
    candidates.forEach((candidate) => {
      console.log(
        `[${candidate.id}] ${candidate.name} 🗳️ ${candidate.votes} votos - (${
          !candidate.votes
            ? 0
            : parseFloat(((candidate.votes / totalVotes) * 100).toFixed(2))
        }%)`
      );
    });
  });
};

getResults();
