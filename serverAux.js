import {
  loadPackageDefinition,
  Server,
  credentials,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const tallyDefs = loadSync("./voting.proto");
const tallyProto = loadPackageDefinition(tallyDefs).VotingService;

const votingClient = new (loadPackageDefinition(tallyDefs).VotingService)(
  "127.0.0.1:5051",
  credentials.createInsecure()
);

const tallyServer = new Server();

tallyServer.addService(tallyProto.service, {
  CountVotes: (call, callback) => {
    votingClient.ListCandidates({}, (err, response) => {
      if (err) {
        callback(err);
        return;
      }

      const candidates = response.candidates.map((candidate) => ({
        id: candidate.id,
        name: candidate.name,
        votes: candidate.votes,
      }));

      callback(null, { candidates });
    });
  },
});

const serverAddress = "0.0.0.0:5052";
tallyServer.bindAsync(
  serverAddress,
  ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.log(`🤯 Erro ao iniciar serviço: ${err.message}`);
      return;
    }
    console.log(`🚀 Servidor de Apuração rodando na porta: ${serverAddress}`);
  }
);
