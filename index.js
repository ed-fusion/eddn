import zlib from 'zlib';
import zmq from 'zeromq';
import axios from 'axios'

const SOURCE_URL = 'tcp://eddn.edcd.io:9500';

const whitelist = ['EDDiscovery', 'E:D Market Connector [Windows]', 'E:D Market Connector [Linux]', 'GameGlass',  'E:D Market Connector [Mac OS]', 'EDSM', 'EDDI']

async function run() {
  const sock = new zmq.Subscriber;

  sock.connect(SOURCE_URL);
  sock.subscribe('');
  console.log('EDDN listener connected to:', SOURCE_URL);

  for await (const [src] of sock) {
    const msg = JSON.parse(zlib.inflateSync(src));
    //console.log(msg)
    try {
      const response = await axios.post(`http://localhost:3333/eddn/receive`, { data: msg })
      //console.log(response.data)
    } catch(e) {
      console.log(e)
    }
    if(whitelist.includes(msg.header.softwareName)) {

      
    } else {
      console.log(whitelist.includes(msg.header.softwareName),msg.header.softwareName)
    }
  }
}

run();