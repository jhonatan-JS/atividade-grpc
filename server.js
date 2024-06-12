import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const votingDefs = loadSync("./voting.proto");
const votingProto = loadPackageDefinition(votingDefs).VotingService;

const votes = [
  { candidateId: 1, name: "Paulo teixeira Alencar", votes: 0 },
  { candidateId: 2, name: "José Pedro", votes: 0 },
  { candidateId: 3, name: "Ana Luiza", votes: 0 },
  { candidateId: 4, name: "Marcela pereira da Cunha", votes: 0 },
];

const votingServer = new Server();

votingServer.addService(votingProto.service, {
  Vote: (call, callback) => {
    const { candidateId } = call.request;
    const findCandidate = votes.find(
      (candidate) => candidate.candidateId === candidateId
    );

    if (findCandidate) {
      findCandidate.votes++;
    }

    callback(null, {
      message: "Voto registrado com sucesso.",
      name: findCandidate.name,
    });
  },

  ListCandidates: (call, callback) => {
    const candidates = votes.map((candidate) => ({
      id: candidate.candidateId,
      name: candidate.name,
      votes: candidate.votes,
    }));

    callback(null, { candidates });
  },
});

const serverAddress = "0.0.0.0:5051";
votingServer.bindAsync(
  serverAddress,
  ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.log(`🤯 Erro ao iniciar serviço de votação: ${err.message}`);
      return;
    }
    console.log(`🚀 Servidor de Votação rodando na porta: ${serverAddress}`);
    votingServer.start();
  }
);
