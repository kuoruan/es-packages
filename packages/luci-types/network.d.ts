// Type definitions for LuCI.network
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.network.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace network;
export = network;

declare namespace network {
  /**
   * Adds a new network of the given name and update it with the given uci option values.
   *
   * If a network with the given name already exist but is empty, then this function will update its option, otherwise it will do nothing.
   *
   * @param name - The name of the network to add. Must be in the format `[a-zA-Z0-9_]+`.
   * @param options - An object of uci option values to set on the new network or to update in an existing, empty network.
   *
   * @returns Returns a promise resolving to the `Protocol` subclass instance describing the added network or resolving to `null` if the name was invalid or if a non-empty network of the given name already existed.
   */
  function addNetwork(
    name: string,
    options?: { [key: string]: string | string[] }
  ): Promise<null | Protocol>;

  function addWifiNetwork(options: {
    [key: string]: string | string[];
  }): Promise<null | WifiNetwork>;

  function deleteNetwork(name: string): Promise<boolean>;

  function deleteWifiNetwork(netname: string): Promise<boolean>;

  function flushCache(): Promise<object>;

  function formatWifiEncryption(encryption: WifiEncryption): string | null;

  function getDevice(name: string): Promise<null | Device>;

  function getDevices(): Promise<Device[]>;

  function getDSLModemType(): Promise<null | string>;

  function getHostHints(): Promise<Hosts>;

  function getIfnameOf(
    obj: Protocol | Device | WifiDevice | WifiNetwork
  ): string | null;

  function getNetwork(name: string): Promise<Protocol | null>;

  function getNetworks(): Promise<Protocol[]>;

  function getProtocol(protoname: string, netname: string): Protocol | null;

  function getProtocols(): Protocol[];

  function getSwitchTopologies(): Promise<{ [key: string]: SwitchTopology }>;

  function getWAN6Networks(): Promise<Protocol[]>;

  function getWANNetworks(): Promise<Protocol[]>;

  function getWifiDevice(devname: string): Promise<WifiDevice>;

  function getWifiDevices(): Promise<WifiDevice[]>;

  function getWifiNetwork(netname: string): Promise<WifiNetwork | null>;

  function getWifiNetworks(): Promise<WifiNetwork[]>;

  function isIgnoredDevice(name: string): boolean;

  function maskToPrefix(netmask: string, v6?: boolean): number | null;

  function prefixToMask(bits: number, v6?: boolean): string | null;

  function registerErrorCode(code: string, message: string): boolean;

  function registerPatternVirtual(pat: RegExp): void;

  function registerProtocol(
    protoname: string,
    methods: { [key: string]: any }
  ): Protocol;

  function renameNetwork(oldName: string, newName: string): Promise<boolean>;

  interface Device {
    getBridgeID(): string | null;

    getBridgeSTP(): boolean;

    getI18n(): string;

    getIP6Addrs(): string[];

    getIPAddrs(): string[];

    getMAC(): string | null;

    getMTU(): number;

    getName(): string;

    getNetwork(): Protocol | null;

    getNetworks(): Protocol[];

    getPorts(): Device[] | null;

    getRXBytes(): number;

    getRXPackets(): number;

    getShortName(): string;

    getTXBytes(): number;

    getTXPackets(): number;

    getType():
      | "alias"
      | "wifi"
      | "bridge"
      | "tunnel"
      | "vlan"
      | "switch"
      | "ethernet";

    getTypeI18n(): string;

    getWifiNetwork(): WifiNetwork | null;

    isBridge(): boolean;

    isBridgePort(): boolean;

    isUp(): boolean;
  }

  class Hosts extends baseclass {
    getHostnameByIP6Addr(ipaddr: string): string | null;

    getHostnameByIPAddr(ipaddr: string): string | null;

    getHostnameByMACAddr(mac: string): string | null;

    getIP6AddrByMACAddr(mac: string): string | null;

    getIPAddrByMACAddr(mac: string): string | null;

    getMACAddrByIP6Addr(ipaddr: string): string | null;

    getMACAddrByIPAddr(ipaddr: string): string | null;

    getMACHints(preferIp6?: boolean): string[][];
  }

  abstract class Protocol extends baseclass {
    addDevice(device: string): boolean;

    containsDevice(
      device: Protocol | Device | WifiDevice | WifiNetwork | string
    ): boolean;

    abstract deleteConfiguration(): any | Promise<any>;

    deleteDevice(
      device: Protocol | Device | WifiDevice | WifiNetwork | string
    ): boolean;

    get(opt: string): string | string[] | null;

    getDevice(): Device;

    getDevices(): Device[] | null;

    getDNS6Addrs(): string[];

    getDNSAddrs(): string[];

    getErrors(): string[];

    getExpiry(): number;

    getGateway6Addr(): string;

    getGatewayAddr(): string;

    abstract getI18n(): string;

    getIfname(): string | null;

    getIP6Addr(): string | null;

    getIP6Addrs(): string[];

    getIP6Prefix(): string | null;

    getIPAddr(): string | null;

    getIPAddrs(): string[];

    getL2Device(): Device;

    getL3Device(): Device;

    getMetric(): number;

    getName(): string;

    getNetmask(): string;

    abstract getOpkgPackage(): string;

    abstract getProtocol(): string;

    getType(): string | null;

    getUptime(): number;

    getZoneName(): string | null;

    isAlias(): string | null;

    isBridge(): boolean;

    abstract isCreateable(ifname: string): Promise<void>;

    isDynamic(): boolean;

    isEmpty(): boolean;

    /**
     * Checks whether this protocol is "floating".
     *
     * A "floating" protocol is a protocol which spawns its own interfaces on demand, like a virtual one but which relies on an existinf lower level interface to initiate the connection.
     *
     * An example for such a protocol is "pppoe".
     *
     * This function exists for backwards compatibility with older code but should not be used anymore.
     *
     * @returns Returns a boolean indicating whether this protocol is floating (`true`) or not (`false`).
     *
     * @deprecated Do not use.
     */
    isFloating(): boolean;

    /**
     * Checks whether the protocol functionality is installed.
     *
     * This function exists for compatibility with old code, it always returns `true`.
     *
     * @deprecated Do not use.
     */
    abstract isInstalled(): boolean;

    /**
     * Checks whether this logical interface is configured and running.
     *
     * @returns Returns `true` when the interface is active or `false` when it is not.
     */
    isUp(): boolean;

    /**
     * Checks whether this protocol is "virtual".
     *
     * A "virtual" protocol is a protocol which spawns its own interfaces on demand instead of using existing physical interfaces.
     *
     * Examples for virtual protocols are `6in4` which `gre` spawn tunnel network device on startup, examples for non-virtual protcols are `dhcp` or `static` which apply IP configuration to existing interfaces.
     *
     * This function should be overwritten by subclasses.
     *
     * @returns Returns a boolean indicating whether the underlying protocol spawns dynamic interfaces (`true`) or not (`false`).
     */
    isVirtual(): boolean;

    /**
     * Set the given UCI option of this network to the given value.
     *
     * @param opt - The name of the UCI option to set.
     * @param val - The value to set or `null` to remove the given option from the configuration.
     */
    set(opt: string, val: string | string[] | null): void;
  }

  class WifiDevice extends baseclass {
    addWifiNetwork(options: { [key: string]: string | string[] }): WifiNetwork;

    deleteWifiNetwork(network: string): Promise<boolean>;

    get(opt: string): string | string[] | null;

    getHTModes(): (
      | "HT20"
      | "HT40"
      | "VHT20"
      | "VHT40"
      | "VHT80"
      | "VHT160"
      | string
    )[];

    getHWModes(): ("a" | "b" | "g" | "n" | "ac" | string)[];

    getI18n(): string;

    getName(): string;

    getScanList(): Promise<WifiScanResult[]>;

    getWifiNetwork(network: string): Promise<WifiNetwork>;

    getWifiNetworks(): Promise<WifiNetwork[]>;

    isDisabled(): boolean;

    isUp(): boolean;

    set(opt: string, val: string | string[] | null): void;
  }

  class WifiNetwork extends baseclass {
    disconnectClient(
      mac: string,
      deauth?: boolean,
      reason?: number,
      ban_time?: number
    ): Promise<number>;

    get(opt: string): string | string[] | null;

    getActiveBSSID(): string;

    getActiveEncryption(): string;

    getActiveMode():
      | "Master"
      | "Ad-Hoc"
      | "Client"
      | "Monitor"
      | "Master (VLAN)"
      | "WDS"
      | "Mesh Point"
      | "P2P Client"
      | "P2P Go"
      | "Unknown";

    getActiveModeI18n(): string;

    getActiveSSID(): string;

    getAssocList(): Promise<WifiPeerEntry[]>;

    getBitRate(): number | null;

    getBSSID(): string | null;

    getChannel(): number | null;

    getCountryCode(): string;

    getDevice(): Device;

    getFrequency(): string | null;

    getI18n(): string;

    getID(): string;

    getIfname(): string;

    getMeshID(): string;

    getMode(): string;

    getName(): string;

    getNetwork(): Protocol | null;

    getNetworkNames(): string[];

    getNetworks(): Protocol[];

    getNoise(): number;

    getShortName(): string;

    getSignal(): number | null;

    /**
     * Calculate the current signal.
     *
     * @returns Returns the calculated signal level, which is the difference between noise and signal (SNR), divided by 5.
     *
     * @deprecated Do not use.
     */
    getSignalLevel(): number;

    getSignalPercent(): number;

    getSSID(): string | null;

    getTXPower(): number | null;

    getTXPowerOffset(): number;

    getWifiDevice(): WifiDevice | null;

    getWifiDeviceName(): string | null;

    isClientDisconnectSupported(): boolean;

    isDisabled(): boolean;

    isUp(): boolean;

    set(opt: string, val: string | string[] | null): void;
  }

  type SwitchTopology = {
    netdevs: { [key: number]: string };

    ports: { [key: string]: boolean | number | string }[];
  };

  type WifiEncryption = {
    enabled: boolean;

    wep: string[];

    wpa: number[];

    authentication: string[];

    ciphers: string[];
  };

  type WifiPeerEntry = {
    mac: string;

    signal: number;

    signal_avg: number;

    noise: number;

    inactive: number;

    connected_time: number;

    thr: number;

    authorized: boolean;

    authenticated: boolean;

    preamble: string;

    wme: boolean;

    mfp: boolean;

    tdls: boolean;

    "mesh llid": number;

    "mesh plid": number;

    "mesh plink": string;

    "mesh local PS": number;

    "mesh peer PS": number;

    "mesh non-peer PS": number;

    rx: WifiRateEntry;

    tx: WifiRateEntry;
  };

  type WifiRateEntry = {
    drop_misc: number;

    packets: number;

    bytes: number;

    failed: number;

    retries: number;

    is_ht: boolean;

    is_vht: boolean;

    mhz: number;

    rate: number;

    mcs: number;

    "40mhz": number;

    short_gi: boolean;

    nss: number;
  };

  type WifiScanResult = {
    ssid: string;

    bssid: string;

    mode: string;

    channel: number;

    signal: number;

    quality: number;

    quality_max: number;

    encryption: WifiEncryption;
  };
}
