const fs = require("fs");
const net = require("net");
const { Client } = require("ssh2");
const bilsoft = require("./bilsoft");

let sshClient;
let tunnelServer;

const sshTunnelBaslat = () => {
  if (!bilsoft.ssh.aktif) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    sshClient = new Client();

    tunnelServer = net.createServer((localSocket) => {
      sshClient.forwardOut(
        localSocket.remoteAddress || bilsoft.ssh.localHost,
        localSocket.remotePort || 0,
        bilsoft.mysql.host,
        bilsoft.mysql.port,
        (err, remoteSocket) => {
          if (err) {
            localSocket.destroy(err);
            return;
          }

          localSocket.pipe(remoteSocket);
          remoteSocket.pipe(localSocket);
        }
      );
    });

    sshClient
      .on("ready", () => {
        tunnelServer.listen(bilsoft.ssh.localPort, bilsoft.ssh.localHost, () => {
          console.log(
            `SSH tunnel aktif: ${bilsoft.ssh.localHost}:${bilsoft.ssh.localPort} -> ${bilsoft.mysql.host}:${bilsoft.mysql.port}`
          );
          resolve(tunnelServer);
        });
      })
      .on("error", reject)
      .connect(sshBaglantiAyari());

    tunnelServer.on("error", reject);
  });
};

const sshBaglantiAyari = () => {
  const ayar = {
    host: bilsoft.ssh.host,
    port: bilsoft.ssh.port,
    username: bilsoft.ssh.username
  };

  if (bilsoft.ssh.privateKeyPath) {
    ayar.privateKey = fs.readFileSync(bilsoft.ssh.privateKeyPath);
  } else {
    ayar.password = bilsoft.ssh.password;
  }

  return ayar;
};

const sshTunnelKapat = () => {
  if (tunnelServer) {
    tunnelServer.close();
  }

  if (sshClient) {
    sshClient.end();
  }
};

module.exports = {
  sshTunnelBaslat,
  sshTunnelKapat
};
