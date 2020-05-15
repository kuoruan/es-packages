// Type definitions for LuCI.network
// Documentation: http://openwrt.github.io/luci/jsapi/LuCI.network.html
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace network;
export = network;

/**
 * The `LuCI.network` class combines data from multiple `ubus` apis to provide an abstraction of the current network configuration state.
 *
 * It provides methods to enumerate interfaces and devices, to query current configuration details and to manipulate settings.
 */
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

  /**
   * Adds a new wireless network to the configuration and sets its options to the provided values.
   *
   * @param options - The options to set for the newly added wireless network. This object must at least contain a `device` property which is set to the radio name the new network belongs to.
   *
   * @returns Returns a promise resolving to a `WifiNetwork` instance describing the newly added wireless network or `null` if the given options were invalid or if the associated radio device could not be found.
   */
  function addWifiNetwork(options: {
    [key: string]: string | string[];
  }): Promise<null | WifiNetwork>;

  /**
   * Deletes the given network and its references from the network and firewall configuration.
   *
   * @param name - The name of the network to delete.
   *
   * @returns Returns a promise resolving to either `true` if the network and references to it were successfully deleted from the configuration or `false` if the given network could not be found.
   */
  function deleteNetwork(name: string): Promise<boolean>;

  /**
   * Deletes the given wireless network from the configuration.
   *
   * @param netname - The name of the network to remove. This may be either a network ID in the form `radio#.network#` or a Linux network device name like `wlan0` which is resolved to the corresponding configuration section through `ubus` runtime information.
   *
   * @returns Returns a promise resolving to `true` if the wireless network has been successfully deleted from the configuration or `false` if it could not be found.
   */
  function deleteWifiNetwork(netname: string): Promise<boolean>;

  /**
   * Flushes the local network state cache and fetches updated information from the remote `ubus` apis.
   *
   * @returns Returns a promise resolving to the internal network state object.
   */
  function flushCache(): Promise<object>;

  /**
   * Converts a given `encryption entry` into a human readable string such as `mixed WPA/WPA2 PSK (TKIP, CCMP)` or `WPA3 SAE (CCMP)`.
   *
   * @param encryption - The wireless encryption entry to convert.
   *
   * @returns Returns the description string for the given encryption entry or `null` if the given entry was invalid.
   */
  function formatWifiEncryption(encryption: WifiEncryption): string | null;

  /**
   * Get a `Device` instance describing the given network device.
   *
   * @param name - The name of the network device to get, e.g. `eth0` or `br-lan`.
   *
   * @returns Returns a promise resolving to the `Device` instance describing the network device or `null` if the given device name could not be found.
   */
  function getDevice(name: string): Promise<null | Device>;

  /**
   * Get a sorted list of all found network devices.
   *
   * @returns Returns a promise resolving to a sorted array of `Device` class instances describing the network devices found on the system.
   */
  function getDevices(): Promise<Device[]>;

  /**
   * Queries the internal DSL modem type from board information.
   *
   * @returns Returns a promise resolving to the type of the internal modem (e.g. `vdsl`) or to `null` if no internal modem is present.
   */
  function getDSLModemType(): Promise<null | string>;

  /**
   * Queries aggregated information about known hosts.
   *
   * This function aggregates information from various sources such as DHCP lease databases, ARP and IPv6 neighbour entries, wireless association list etc. and returns a `Hosts` class instance describing the found hosts.
   *
   * @returns Returns a `Hosts` instance describing host known on the system.
   */
  function getHostHints(): Promise<Hosts>;

  /**
   * Obtains the the network device name of the given object.
   *
   * @param obj - The object to get the device name from.
   *
   * @returns Returns a string containing the device name or `null` if the given object could not be converted to a name.
   */
  function getIfnameOf(
    obj: Protocol | Device | WifiDevice | WifiNetwork
  ): string | null;

  /**
   * Get a `Protocol` instance describing the network with the given name.
   *
   * @param name - The logical interface name of the network get, e.g. `lan` or `wan`.
   *
   * @returns Returns a promise resolving to a `Protocol` subclass instance describing the network or `null` if the network did not exist.
   */
  function getNetwork(name: string): Promise<Protocol | null>;

  /**
   * Gets an array containing all known networks.
   *
   * @returns Returns a promise resolving to a name-sorted array of `Protocol` subclass instances describing all known networks.
   */
  function getNetworks(): Promise<Protocol[]>;

  /**
   * Instantiates the given `Protocol` backend, optionally using the given network name.
   *
   * @param protoname - The protocol backend to use, e.g. `static` or `dhcp`.
   * @param netname - The network name to use for the instantiated protocol. This should be usually set to one of the interfaces described in /etc/config/network but it is allowed to omit it, e.g. to query protocol capabilities without the need for an existing interface.
   *
   * @returns Returns the instantiated protocol backend class or `null` if the given protocol isn't known.
   */
  function getProtocol(protoname: string, netname?: string): Protocol | null;

  /**
   * Obtains instances of all known `Protocol` backend classes.
   *
   * @returns Returns an array of protocol class instances.
   */
  function getProtocols(): Protocol[];

  /**
   * Returns the topologies of all swconfig switches found on the system.
   *
   * @returns Returns a promise resolving to an object containing the topologies of each switch. The object keys correspond to the name of the switches such as `switch0`, the values are `SwitchTopology` objects describing the layout.
   */
  function getSwitchTopologies(): Promise<{ [key: string]: SwitchTopology }>;

  /**
   * Get IPv6 wan networks.
   *
   * This function looks up all networks having a default `::/0` route and returns them as array.
   *
   * @returns Returns a promise resolving to an array of `Protocol` subclass instances describing the found IPv6 default route interfaces.
   */
  function getWAN6Networks(): Promise<Protocol[]>;

  /**
   * Get IPv4 wan networks.
   *
   * This function looks up all networks having a default `0.0.0.0/0` route and returns them as array.
   *
   * @returns Returns a promise resolving to an array of `Protocol` subclass instances describing the found default route interfaces.
   */
  function getWANNetworks(): Promise<Protocol[]>;

  /**
   * Get a `WifiDevice` instance describing the given wireless radio.
   *
   * @param devname - The configuration name of the wireless radio to lookup, e.g. `radio0` for the first mac80211 phy on the system.
   *
   * @returns Returns a promise resolving to the `WifiDevice` instance describing the underlying radio device or `null` if the wireless radio could not be found.
   */
  function getWifiDevice(devname: string): Promise<WifiDevice>;

  /**
   * Obtain a list of all configured radio devices.
   *
   * @returns Returns a promise resolving to an array of `WifiDevice` instances describing the wireless radios configured in the system. The order of the array corresponds to the order of the radios in the configuration.
   */
  function getWifiDevices(): Promise<WifiDevice[]>;

  /**
   * Get a `WifiNetwork` instance describing the given wireless network.
   *
   * @param netname - The name of the wireless network to lookup. This may be either an uci configuration section ID, a network ID in the form `radio#.network#` or a Linux network device name like `wlan0` which is resolved to the corresponding configuration section through `ubus` runtime information.
   *
   * @returns Returns a promise resolving to the `WifiNetwork` instance describing the wireless network or `null` if the corresponding network could not be found.
   */
  function getWifiNetwork(netname: string): Promise<WifiNetwork | null>;

  /**
   * Get an array of all `WifiNetwork` instances describing the wireless networks present on the system.
   *
   * @returns Returns a promise resolving to an array of `WifiNetwork` instances describing the wireless networks. The array will be empty if no networks are found.
   */
  function getWifiNetworks(): Promise<WifiNetwork[]>;

  /**
   * Test if a given network device name is in the list of patterns for device names to ignore.
   *
   * Ignored device names are usually Linux network devices which are spawned implicitly by kernel modules such as `tunl0` or `hwsim0` and which are unsuitable for use in network configuration.
   *
   * @param name - The device name to test.
   *
   * @returns Returns `true` if the given name is in the ignore pattern list, else returns `false`.
   */
  function isIgnoredDevice(name: string): boolean;

  /**
   * Converts the given netmask to a prefix size in bits.
   *
   * @param netmask - The netmask to convert into a bit count.
   * @param v6 - Whether to parse the given netmask as IPv4 (`false`) or IPv6 (`true`) address.
   *
   * @returns Returns the number of prefix bits contained in the netmask or `null` if the given netmask value was invalid.
   */
  function maskToPrefix(netmask: string, v6?: boolean): number | null;

  /**
   * Converts the given prefix size in bits to a netmask.
   *
   * @param bits - The prefix size in bits.
   * @param v6 - Whether to convert the bits value into an IPv4 netmask (`false`) or an IPv6 netmask (`true`).
   *
   * @returns Returns a string containing the netmask corresponding to the bit count or `null` when the given amount of bits exceeds the maximum possible value of `32` for IPv4 or `128` for IPv6.
   */
  function prefixToMask(bits: number, v6?: boolean): string | null;

  /**
   * Registers a new human readable translation string for a `Protocol` error code.
   *
   * @param code - The `ubus` protocol error code to register a translation for, e.g. `NO_DEVICE`.
   * @param message - The message to use as translation for the given protocol error code.
   *
   * @returns Returns `true` if the error code description has been added or `false` if either the arguments were invalid or if there already was a description for the given code.
   */
  function registerErrorCode(code: string, message: string): boolean;

  /**
   * Registers a new regular expression pattern to recognize virtual interfaces.
   *
   * @param pat - A `RegExp` instance to match a virtual interface name such as `6in4-wan` or `tun0`.
   */
  function registerPatternVirtual(pat: RegExp): void;

  /**
   * Registers a new `Protocol` subclass with the given methods and returns the resulting subclass value.
   *
   * This functions internally calls `Class.extend()` on the `Network.Protocol` base class.
   *
   * @param protoname - The name of the new protocol to register.
   * @param methods - The member methods and values of the new `Protocol` subclass to be passed to `Class.extend()`.
   *
   * @returns Returns the new `Protocol` subclass.
   */
  function registerProtocol(
    protoname: string,
    methods: { [key: string]: any }
  ): Protocol;

  /**
   * Rename the given network and its references to a new name.
   *
   * @param oldName - The current name of the network.
   * @param newName - The name to rename the network to, must be in the format `[a-z-A-Z0-9_]+`.
   *
   * @returns Returns a promise resolving to either `true` if the network was successfully renamed or `false` if the new name was invalid, if a network with the new name already exists or if the network to rename could not be found.
   */
  function renameNetwork(oldName: string, newName: string): Promise<boolean>;

  /**
   * A `Network.Device` class instance represents an underlying Linux network device and allows querying device details such as packet statistics or MTU.
   */
  class Device extends baseclass {
    /**
     * Get the bridge ID
     *
     * @returns Returns the ID of this network bridge or `null` if this network device is not a Linux bridge.
     */
    getBridgeID(): string | null;

    /**
     * Get the bridge STP setting
     *
     * @returns Returns `true` when this device is a Linux bridge and has `stp` enabled, else `false`.
     */
    getBridgeSTP(): boolean;

    /**
     * Get a long description string for the device.
     *
     * @returns Returns a string containing the type description and device name for non-wifi devices or operation mode and ssid for wifi ones.
     */
    getI18n(): string;

    /**
     * Get the IPv6 addresses configured on the device.
     *
     * @returns Returns an array of IPv6 address strings.
     */
    getIP6Addrs(): string[];

    /**
     * Get the IPv4 addresses configured on the device.
     *
     * @returns Returns an array of IPv4 address strings.
     */
    getIPAddrs(): string[];

    /**
     * Get the MAC address of the device.
     *
     * @returns Returns the MAC address of the device or `null` if not applicable, e.g. for non-ethernet tunnel devices.
     */
    getMAC(): string | null;

    /**
     * Get the MTU of the device.
     *
     * @returns Returns the MTU of the device.
     */
    getMTU(): number;

    /**
     * Get the name of the network device.
     *
     * @returns Returns the name of the device, e.g. `eth0` or `wlan0`.
     */
    getName(): string;

    /**
     * Get the primary logical interface this device is assigned to.
     *
     * @returns Returns a `Network.Protocol` instance representing the logical interface this device is attached to or `null` if it is not assigned to any logical interface.
     */
    getNetwork(): Protocol | null;

    /**
     * Get the logical interfaces this device is assigned to.
     *
     * @returns Returns an array of `Network.Protocol` instances representing the logical interfaces this device is assigned to.
     */
    getNetworks(): Protocol[];

    /**
     * Get the associated bridge ports of the device.
     *
     * @returns Returns an array of `Network.Device` instances representing the ports (slave interfaces) of the bridge or `null` when this device isn't a Linux bridge.
     */
    getPorts(): Device[] | null;

    /**
     * Get the amount of received bytes.
     *
     * @returns Returns the amount of bytes received by the network device.
     */
    getRXBytes(): number;

    /**
     * Get the amount of received packets.
     *
     * @returns Returns the amount of packets received by the network device.
     */
    getRXPackets(): number;

    /**
     * Get a short description string for the device.
     *
     * @returns Returns the device name for non-wifi devices or a string containing the operation mode and SSID for wifi devices.
     */
    getShortName(): string;

    /**
     * Get the amount of transmitted bytes.
     *
     * @returns Returns the amount of bytes transmitted by the network device.
     */
    getTXBytes(): number;

    /**
     * Get the amount of transmitted packets.
     *
     * @returns Returns the amount of packets transmitted by the network device.
     */
    getTXPackets(): number;

    /**
     * Get the type of the device..
     *
     * @returns Returns a string describing the type of the network device:
     * - `alias` if it is an abstract alias device (`@` notation)
     * - `wifi` if it is a wireless interface (e.g. `wlan0`)
     * - `bridge` if it is a bridge device (e.g. `br-lan`)
     * - `tunnel` if it is a tun or tap device (e.g. `tun0`)
     * - `vlan` if it is a vlan device (e.g. `eth0.1`)
     * - `switch` if it is a switch device (e.g. `eth1` connected to switch0)
     * - `ethernet` for all other device types
     */
    getType():
      | "alias"
      | "wifi"
      | "bridge"
      | "tunnel"
      | "vlan"
      | "switch"
      | "ethernet";

    /**
     * Get a string describing the device type.
     *
     * @returns Returns a string describing the type, e.g. "Wireless Adapter" or "Bridge".
     */
    getTypeI18n(): string;

    /**
     * Get the related wireless network this device is related to.
     *
     * @returns Returns a `Network.WifiNetwork` instance representing the wireless network corresponding to this network device or `null` if this device is not a wireless device.
     */
    getWifiNetwork(): WifiNetwork | null;

    /**
     * Checks whether this device is a Linux bridge.
     *
     * @returns Returns `true` when the network device is present and a Linux bridge, else `false`.
     */
    isBridge(): boolean;

    /**
     * Checks whether this device is part of a Linux bridge.
     *
     * @returns Returns `true` when this network device is part of a bridge, else `false`.
     */
    isBridgePort(): boolean;

    /**
     * Checks whether this device is up.
     *
     * @returns Returns `true` when the associated device is running pr `false` when it is down or absent.
     */
    isUp(): boolean;
  }

  /**
   * The `LuCI.network.Hosts` class encapsulates host information aggregated from multiple sources and provides convenience functions to access the host information by different criteria.
   */
  class Hosts extends baseclass {
    /**
     * Lookup the hostname associated with the given IPv6 address.
     *
     * @param ipaddr - The IPv6 address to lookup.
     *
     * @returns Returns the hostname associated with the given IPv6 or `null` if no matching host could be found or if no hostname is known for the corresponding host.
     */
    getHostnameByIP6Addr(ipaddr: string): string | null;

    /**
     * Lookup the hostname associated with the given IPv4 address.
     *
     * @param ipaddr - The IPv4 address to lookup.
     *
     * @returns Returns the hostname associated with the given IPv4 or `null` if no matching host could be found or if no hostname is known for the corresponding host.
     */
    getHostnameByIPAddr(ipaddr: string): string | null;

    /**
     * Lookup the hostname associated with the given MAC address.
     *
     * @param mac - The MAC address to lookup.
     *
     * @returns Returns the hostname associated with the given MAC or `null` if no matching host could be found or if no hostname is known for the corresponding host.
     */
    getHostnameByMACAddr(mac: string): string | null;

    /**
     * Lookup the IPv6 address associated with the given MAC address.
     *
     * @param mac - The MAC address to lookup.
     *
     * @returns Returns the IPv6 address associated with the given MAC or `null` if no matching host could be found or if no IPv6 address is known for the corresponding host.
     */
    getIP6AddrByMACAddr(mac: string): string | null;

    /**
     * Lookup the IPv4 address associated with the given MAC address.
     *
     * @param mac - The MAC address to lookup.
     *
     * @returns Returns the IPv4 address associated with the given MAC or `null` if no matching host could be found or if no IPv4 address is known for the corresponding host.
     */
    getIPAddrByMACAddr(mac: string): string | null;

    /**
     * Lookup the MAC address associated with the given IPv6 address.
     *
     * @param ipaddr - The IPv6 address to lookup.
     *
     * @returns Returns the MAC address associated with the given IPv6 or `null` if no matching host could be found or if no MAC address is known for the corresponding host.
     */
    getMACAddrByIP6Addr(ipaddr: string): string | null;

    /**
     * Lookup the MAC address associated with the given IPv4 address.
     *
     * @param ipaddr - The IPv4 address to lookup.
     *
     * @returns Returns the MAC address associated with the given IPv4 or `null` if no matching host could be found or if no MAC address is known for the corresponding host.
     */
    getMACAddrByIPAddr(ipaddr: string): string | null;

    /**
     * Return an array of (MAC address, name hint) tuples sorted by MAC address.
     *
     * @param preferIp6 - Whether to prefer IPv6 addresses (`true`) or IPv4 addresses (`false`) as name hint when no hostname is known for a specific MAC address.
     *
     * @returns Returns an array of arrays containing a name hint for each found MAC address on the system. The array is sorted ascending by MAC. Each item of the resulting array is a two element array with the MAC being the first element and the name hint being the second element. The name hint is either the hostname, an IPv4 or an IPv6 address related to the MAC address.
     *
     * If no hostname but both IPv4 and IPv6 addresses are known, the `preferIP6` flag specifies whether the IPv6 or the IPv4 address is used as hint.
     */
    getMACHints(preferIp6?: boolean): string[][];
  }

  /**
   * The `Network.Protocol` class serves as base for protocol specific subclasses which describe logical UCI networks defined by `config interface` sections in `/etc/config/network`.
   */
  abstract class Protocol extends baseclass {
    /**
     * Add the given network device to the logical interface.
     *
     * @param device - The object or device name to add to the logical interface. In case the given argument is not a string, it is resolved though the `Network.getIfnameOf()` function.
     *
     * @returns Returns `true` if the device name has been added or `false` if any argument was invalid, if the device was already part of the logical interface or if the logical interface is virtual.
     */
    addDevice(
      device: Protocol | Device | WifiDevice | WifiNetwork | string
    ): boolean;

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

  /**
   * A `Network.WifiNetwork` instance represents a wireless network (vif) configured on top of a radio device and provides functions for querying the runtime state of the network. Most radio devices support multiple such networks in parallel.
   */
  class WifiNetwork extends baseclass {
    /**
     * Forcibly disconnect the given client from the wireless network.
     *
     * @param mac - The MAC address of the client to disconnect.
     * @param deauth - Specifies whether to deauthenticate (`true`) or disassociate (`false`) the client.
     * @param reason - Specifies the IEEE 802.11 reason code to disassoc/deauth the client with. Default is `1` which corresponds to `Unspecified reason`.
     * @param ban_time - Specifies the amount of milliseconds to ban the client from reconnecting. By default, no ban time is set which allows the client to reassociate / reauthenticate immediately.
     *
     * @returns Returns a promise resolving to the underlying ubus call result code which is typically `0`, even for not existing MAC addresses. The promise might reject with an error in case invalid arguments are passed.
     */
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

  /**
   * Describes an swconfig switch topology by specifying the CPU connections and external port labels of a switch.
   */
  type SwitchTopology = {
    /**
     * The `netdevs` property points to an object describing the CPU port connections of the switch. The numeric key of the enclosed object is the port number, the value contains the Linux network device name the port is hardwired to.
     */
    netdevs: { [key: number]: string };

    /**
     * The `ports` property points to an array describing the populated ports of the switch in the external label order. Each array item is an object containg the following keys:
     * - `num` - the internal switch port number
     * - `label` - the label of the port, e.g. `LAN 1` or `CPU (eth0)`
     * - `device` - the connected Linux network device name (CPU ports only)
     * - `tagged` - a boolean indicating whether the port must be tagged to function (CPU ports only)
     */
    ports: { [key: string]: boolean | number | string }[];
  };

  /**
   * An encryption entry describes active wireless encryption settings such as the used key management protocols, active ciphers and protocol versions.
   */
  type WifiEncryption = {
    /**
     * Specifies whether any kind of encryption, such as `WEP` or `WPA` is enabled. If set to `false`, then no encryption is active and the corresponding network is open.
     */
    enabled: boolean;

    /**
     * When the `wep` property exists, the network uses WEP encryption. In this case, the property is set to an array of active WEP modes which might be either `open`, `shared` or both.
     */
    wep?: string[];

    /**
     * When the `wpa` property exists, the network uses WPA security. In this case, the property is set to an array containing the WPA protocol versions used, e.g. `[ 1, 2 ]` for WPA/WPA2 mixed mode or `[ 3 ]` for WPA3-SAE.
     */
    wpa?: number[];

    /**
     * The `authentication` property only applies to WPA encryption and is defined when the `wpa` property is set as well. It points to an array of active authentication suites used by the network, e.g. `[ "psk" ]` for a WPA(2)-PSK network or `[ "psk", "sae" ]` for mixed WPA2-PSK/WPA3-SAE encryption.
     */
    authentication?: string[];

    /**
     * If either WEP or WPA encryption is active, then the `ciphers` property will be set to an array describing the active encryption ciphers used by the network, e.g. `[ "tkip", "ccmp" ]` for a WPA/WPA2-PSK mixed network or `[ "wep-40", "wep-104" ]` for an WEP network.
     */
    ciphers?: string[];
  };

  /**
   * A wireless peer entry describes the properties of a remote wireless peer associated with a local network.
   */
  type WifiPeerEntry = {
    /**
     * The MAC address (BSSID).
     */
    mac: string;

    /**
     * The received signal strength.
     */
    signal: number;

    /**
     * The average signal strength if supported by the driver.
     */
    signal_avg?: number;

    /**
     * The current noise floor of the radio. May be `0` or absent if not supported by the driver.
     */
    noise?: number;

    /**
     * The amount of milliseconds the peer has been inactive, e.g. due to powersave.
     */
    inactive: number;

    /**
     * The amount of milliseconds the peer is associated to this network.
     */
    connected_time: number;

    /**
     * The estimated throughput of the peer, May be `0` or absent if not supported by the driver.
     */
    thr?: number;

    /**
     * Specifies whether the peer is authorized to associate to this network.
     */
    authorized: boolean;

    /**
     * Specifies whether the peer completed authentication to this network.
     */
    authenticated: boolean;

    /**
     * The preamble mode used by the peer. May be `long` or `short`.
     */
    preamble: "long" | "short";

    /**
     * Specifies whether the peer supports WME/WMM capabilities.
     */
    wme: boolean;

    /**
     * Specifies whether management frame protection is active.
     */
    mfp: boolean;

    /**
     * Specifies whether TDLS is active.
     */
    tdls: boolean;

    /**
     * The mesh LLID, may be `0` or absent if not applicable or supported by the driver.
     */
    "mesh llid"?: number;

    /**
     * The mesh PLID, may be `0` or absent if not applicable or supported by the driver.
     */
    "mesh plid"?: number;

    /**
     * The mesh peer link state description, may be an empty string (`''`) or absent if not applicable or supported by the driver.
     *
     * The following states are known:
     * - `LISTEN`
     * - `OPN_SNT`
     * - `OPN_RCVD`
     * - `CNF_RCVD`
     * - `ESTAB`
     * - `HOLDING`
     * - `BLOCKED`
     * - `UNKNOWN`
     */
    "mesh plink"?: string;

    /**
     * The local powersafe mode for the peer link, may be an empty string (`''`) or absent if not applicable or supported by the driver.
     *
     * The following modes are known:
     * - `ACTIVE` (no power save)
     * - `LIGHT SLEEP`
     * - `DEEP SLEEP`
     * - `UNKNOWN`
     */
    "mesh local PS"?: number;

    /**
     * The remote powersafe mode for the peer link, may be an empty string (`''`) or absent if not applicable or supported by the driver.
     *
     * The following modes are known:
     * - `ACTIVE` (no power save)
     * - `LIGHT SLEEP`
     * - `DEEP SLEEP`
     * - `UNKNOWN`
     */
    "mesh peer PS"?: number;

    /**
     * The powersafe mode for all non-peer neigbours, may be an empty string (`''`) or absent if not applicable or supported by the driver.
     *
     * The following modes are known:
     * - `ACTIVE` (no power save)
     * - `LIGHT SLEEP`
     * - `DEEP SLEEP`
     * - `UNKNOWN`
     */
    "mesh non-peer PS"?: number;

    /**
     * Describes the receiving wireless rate from the peer.
     */
    rx: WifiRateEntry;

    /**
     * Describes the transmitting wireless rate to the peer.
     */
    tx: WifiRateEntry;
  };

  /**
   * A wireless rate entry describes the properties of a wireless transmission rate to or from a peer.
   */
  type WifiRateEntry = {
    /**
     * The amount of received misc. packages that have been dropped, e.g. due to corruption or missing authentication. Only applicable to receiving rates.
     */
    drop_misc?: number;

    /**
     * The amount of packets that have been received or sent.
     */
    packets: number;

    /**
     * The amount of bytes that have been received or sent.
     */
    bytes: number;

    /**
     * The amount of failed tranmission attempts. Only applicable to transmit rates.
     */
    failed?: number;

    /**
     * The amount of retried transmissions. Only applicable to transmit rates.
     */
    retries?: number;

    /**
     * Specifies whether this rate is an HT (IEEE 802.11n) rate.
     */
    is_ht: boolean;

    /**
     * Specifies whether this rate is an VHT (IEEE 802.11ac) rate.
     */
    is_vht: boolean;

    /**
     * The channel width in MHz used for the transmission.
     */
    mhz: number;

    /**
     * The bitrate in bit/s of the transmission.
     */
    rate: number;

    /**
     * The MCS index of the used transmission rate. Only applicable to HT or VHT rates.
     */
    mcs?: number;

    /**
     * Specifies whether the tranmission rate used 40MHz wide channel. Only applicable to HT or VHT rates.
     *
     * Note: this option exists for backwards compatibility only and its use is discouraged. The `mhz` field should be used instead to determine the channel width.
     */
    "40mhz"?: number;

    /**
     * Specifies whether a short guard interval is used for the transmission. Only applicable to HT or VHT rates.
     */
    short_gi?: boolean;

    /**
     * Specifies the number of spatial streams used by the transmission. Only applicable to VHT rates.
     */
    nss?: number;
  };

  /**
   * A wireless scan result object describes a neighbouring wireless network found in the vincinity.
   */
  type WifiScanResult = {
    /**
     * The SSID / Mesh ID of the network.
     */
    ssid: string;

    /**
     * The BSSID if the network.
     */
    bssid: string;

    /**
     * The operation mode of the network (`Master`, `Ad-Hoc`, `Mesh Point`).
     */
    mode: string;

    /**
     * The wireless channel of the network.
     */
    channel: number;

    /**
     * The received signal strength of the network in dBm.
     */
    signal: number;

    /**
     * The numeric quality level of the signal, can be used in conjunction with `quality_max` to calculate a quality percentage.
     */
    quality: number;

    /**
     * The maximum possible quality level of the signal, can be used in conjunction with `quality` to calculate a quality percentage.
     */
    quality_max: number;

    /**
     * The encryption used by the wireless network.
     */
    encryption: WifiEncryption;
  };
}
