import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import readline from "readline";

const votingDefs = loadSync("./voting.proto");
const votingProto = loadPackageDefinition(votingDefs);

const scanLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = new votingProto.VotingService(
  "127.0.0.1:5051",
  credentials.createInsecure()
);

const vote = (candidateId) => {
  client.Vote({ candidateId }, (err, response) => {
    if (err) {
      console.log("❌ Erro ao votar:", err);
      return;
    }

    console.log(`\n${response.message}`);
    scanLine.close();
  });
};

const ListCandidates = () => {
  client.ListCandidates({}, (err, response) => {
    const candidates = response.candidates;

    if (err) {
      console.log("❌ Erro ao listar candidatos:", err);
      return;
    }

    const handleInput = (value) => {
      if (isNaN(value)) {
        console.log(
          "❌ ID de candidato inválido. Por favor, insira um ID válido."
        );
        return false;
      }

      if (value < 1 || value > candidates.length) {
        console.log(
          "❌ ID de candidato inválido. Por favor, insira um ID válido."
        );
        return false;
      }

      return true;
    };

    setTimeout(() => {
      scanLine.question(
        "\nInsira o ID do candidato para votar: ",
        (inputId) => {
          const candidateId = parseInt(inputId);
          const resultValidate = handleInput(candidateId);

          if (!resultValidate) {
            ListCandidates();
            return;
          }
          vote(candidateId);
        }
      );
    }, 100);

    candidates.map((candidate) => {
      console.log(`[${candidate.id}] - ${candidate.name}`);
    });
  });
};

ListCandidates();
