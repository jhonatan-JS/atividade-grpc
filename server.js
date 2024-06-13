import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

const votingDefs = loadSync('./voting.proto');
const votingProto = loadPackageDefinition(votingDefs).VotingService;

const votes = [
  { candidateId: 1, name: 'João da Silva', votes: 0 },
  { candidateId: 2, name: 'Fernando Santos', votes: 0 },
  { candidateId: 3, name: 'Carlos Oliveira', votes: 0 },
  { candidateId: 4, name: 'Ricardo Almeida', votes: 0 },
  { candidateId: 5, name: 'Felipe Martins', votes: 0 },
  { candidateId: 6, name: 'Dilma Ferreira', votes: 0 },
  { candidateId: 7, name: 'Mariana Costa', votes: 0 },
  { candidateId: 8, name: 'Fernanda Souza', votes: 0 },
  { candidateId: 9, name: 'Patrícia Lima', votes: 0 },
  { candidateId: 10, name: 'Renata Barbosa', votes: 0 },
];

const votingServer = new Server();
const ipVoted = [];

votingServer.addService(votingProto.service, {
  Vote: (call, callback) => {
    const { candidateId } = call.request;
    const findCandidate = votes.find(
      (candidate) => candidate.candidateId === candidateId
    );

    const ip = call.getPeer().split(':');
    console.log(ip[0]);
    console.log(ipVoted);
    let message = '';
    let name = '';

    const isVoted = ipVoted.find((ipVoted) =>
      ip[0] === ipVoted ? true : false
    );

    if (findCandidate && !isVoted) {
      findCandidate.votes++;
      ipVoted.push(ip[0]);
      message = '📥 Voto registrado com sucesso';
      name = findCandidate.name;
    } else {
      message = `Cliente com ${ip} já votou!`;
      votingServer.forceShutdown();
    }

    callback(null, {
      message,
      name,
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

const serverAddress = '0.0.0.0:5051';
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
