export as namespace network;
export = network;

declare namespace network {
  function addNetwork(
    name: string,
    options: { [key: string]: string | string[] }
  ): Promise<null | Protocol>;

  function getNetworks(): Promise<Protocol[]>;

  class Device {}

  class Hosts {}

  class Protocol {
    addDevice(device: string): boolean;
  }

  class WifiDevice {}

  class WifiNetwork {}
}
