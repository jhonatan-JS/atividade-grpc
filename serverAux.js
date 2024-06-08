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
  GetResults: (call, callback) => {
    console.log("🔥 Apuração solicitada", callback.response);

    votingClient.getResults({}, (err, response) => {
      if (err) {
        console.log(`🤯 Erro ao buscar resultado: ${err.message}`);
        return;
      }

      callback(null, { results: response.results });
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
