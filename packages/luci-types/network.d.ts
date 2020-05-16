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

    /**
     * Checks whether this logical interface contains the given device object.
     *
     * @param device - The object or device name to check. In case the given argument is not a string, it is resolved though the `Network.getIfnameOf()` function.
     *
     * @returns Returns `true` when this logical interface contains the given network device or `false` if not.
     */
    containsDevice(
      device: Protocol | Device | WifiDevice | WifiNetwork | string
    ): boolean;

    /**
     * Cleanup related configuration entries.
     *
     * This function will be invoked if an interface is about to be removed from the configuration and is responsible for performing any required cleanup tasks, such as unsetting uci entries in related configurations.
     *
     * It should be overwritten by protocol specific subclasses.
     *
     * @returns This function may return a promise which is awaited before the rest of the configuration is removed. Any non-promise return value and any resolved promise value is ignored. If the returned promise is rejected, the interface removal will be aborted.
     */
    abstract deleteConfiguration(): any | Promise<any>;

    /**
     * Remove the given network device from the logical interface.
     *
     * @param device - The object or device name to remove from the logical interface. In case the given argument is not a string, it is resolved though the `Network.getIfnameOf()` function.
     *
     * @returns Returns `true` if the device name has been added or `false` if any argument was invalid, if the device was already part of the logical interface or if the logical interface is virtual.
     */
    deleteDevice(
      device: Protocol | Device | WifiDevice | WifiNetwork | string
    ): boolean;

    /**
     * Read the given UCI option value of this network.
     *
     * @param opt - The UCI option name to read.
     *
     * @returns Returns the UCI option value or `null` if the requested option is not found.
     */
    get(opt: string): string | string[] | null;

    /**
     * Returns the Linux network device associated with this logical interface.
     *
     * @returns Returns a `Network.Device` class instance representing the expected Linux network device according to the configuration.
     */
    getDevice(): Device;

    /**
     * Returns a list of network sub-devices associated with this logical interface.
     *
     * @returns Returns an array of of `Network.Device` class instances representing the sub-devices attached to this logical interface or `null` if the logical interface does not support sub-devices, e.g. because it is virtual and not a bridge.
     */
    getDevices(): Device[] | null;

    /**
     * Query the IPv6 DNS servers associated with the logical interface.
     *
     * @returns Returns an array of IPv6 DNS servers registered by the remote protocol backend.
     */
    getDNS6Addrs(): string[];

    /**
     * Query the IPv4 DNS servers associated with the logical interface.
     *
     * @returns Returns an array of IPv4 DNS servers registered by the remote protocol backend.
     */
    getDNSAddrs(): string[];

    /**
     * Query interface error messages published in `ubus` runtime state.
     *
     * Interface errors are emitted by remote protocol handlers if the setup of the underlying logical interface failed, e.g. due to bad configuration or network connectivity issues.
     *
     * This function will translate the found error codes to human readable messages using the descriptions registered by `Network.registerErrorCode()` and fall back to `"Unknown error (%s)"` where `%s` is replaced by the error code in case no translation can be found.
     *
     * @returns Returns an array of translated interface error messages.
     */
    getErrors(): string[];

    /**
     * Get the logical interface expiry time in seconds.
     *
     * For protocols that have a concept of a lease, such as DHCP or DHCPv6, this function returns the remaining time in seconds until the lease expires.
     *
     * @returns Returns the amount of seconds until the lease expires or `-1` if it isn't applicable to the associated protocol.
     */
    getExpiry(): number;

    /**
     * Query the gateway (nexthop) of the IPv6 default route associated with this logical interface.
     *
     * @returns Returns a string containing the IPv6 nexthop address of the associated default route or `null` if no default route was found.
     */
    getGateway6Addr(): string;

    /**
     * Query the gateway (nexthop) of the default route associated with this logical interface.
     *
     * @returns Returns a string containing the IPv4 nexthop address of the associated default route or `null` if no default route was found.
     */
    getGatewayAddr(): string;

    /**
     * Return a human readable description for the protcol, such as `Static address` or `DHCP client`.
     *
     * This function should be overwritten by subclasses.
     *
     * @returns Returns the description string.
     */
    abstract getI18n(): string;

    /**
     * Get the associared Linux network device of this network.
     *
     * @returns Returns the name of the associated network device or `null` if it could not be determined.
     */
    getIfname(): string | null;

    /**
     * Query the first (primary) IPv6 address of the logical interface.
     *
     * @returns Returns the primary IPv6 address registered by the protocol handler in CIDR notation or `null` if no IPv6 addresses were set.
     */
    getIP6Addr(): string | null;

    /**
     * Query all IPv6 addresses of the logical interface.
     *
     * @returns Returns an array of IPv6 addresses in CIDR notation which have been registered by the protocol handler. The order of the resulting array follows the order of the addresses in `ubus` runtime information.
     */
    getIP6Addrs(): string[];

    /**
     * Query the routed IPv6 prefix associated with the logical interface.
     *
     * @returns Returns the routed IPv6 prefix registered by the remote protocol handler or `null` if no prefix is present.
     */
    getIP6Prefix(): string | null;

    /**
     * Query the first (primary) IPv4 address of the logical interface.
     *
     * @returns Returns the primary IPv4 address registered by the protocol handler or `null` if no IPv4 addresses were set.
     */
    getIPAddr(): string | null;

    /**
     * Query all IPv4 addresses of the logical interface.
     *
     * @returns Returns an array of IPv4 addresses in CIDR notation which have been registered by the protocol handler. The order of the resulting array follows the order of the addresses in `ubus` runtime information.
     */
    getIPAddrs(): string[];

    /**
     * Returns the layer 2 linux network device currently associated with this logical interface.
     *
     * @returns Returns a `Network.Device` class instance representing the Linux network device currently associated with the logical interface.
     */
    getL2Device(): Device;

    /**
     * Returns the layer 3 linux network device currently associated with this logical interface.
     *
     * @returns Returns a `Network.Device` class instance representing the Linux network device currently associated with the logical interface.
     */
    getL3Device(): Device;

    /**
     * Get the metric value of the logical interface.
     *
     * @returns Returns the current metric value used for device and network routes spawned by the associated logical interface.
     */
    getMetric(): number;

    /**
     * Get the name of the associated logical interface.
     *
     * @returns Returns the logical interface name, such as `lan` or `wan`.
     */
    getName(): string;

    /**
     * Query the first (primary) IPv4 netmask of the logical interface.
     *
     * @returns Returns the netmask of the primary IPv4 address registered by the protocol handler or `null` if no IPv4 addresses were set.
     */
    getNetmask(): string | null;

    /**
     * Get the name of the opkg package providing the protocol functionality.
     *
     * This function should be overwritten by protocol specific subclasses.
     *
     * @returns Returns the name of the opkg package required for the protocol to function, e.g. `odhcp6c` for the `dhcpv6` prototocol.
     */
    abstract getOpkgPackage(): string;

    /**
     * Get the name of this network protocol class.
     *
     * This function will be overwritten by subclasses created by `Network.registerProtocol()`.
     *
     * @returns Returns the name of the network protocol implementation, e.g. `static` or `dhcp`.
     */
    abstract getProtocol(): string;

    /**
     * Get the type of the underlying interface.
     *
     * This function actually is a convenience wrapper around `proto.get("type")` and is mainly used by other `LuCI.network` code to check whether the interface is declared as bridge in UCI.
     *
     * @returns Returns the value of the `type` option of the associated logical interface or `null` if no type option is set.
     */
    getType(): string | null;

    /**
     * Get the uptime of the logical interface.
     *
     * @returns Returns the uptime of the associated interface in seconds.
     */
    getUptime(): number;

    /**
     * Get the requested firewall zone name of the logical interface.
     *
     * Some protocol implementations request a specific firewall zone to trigger inclusion of their resulting network devices into the firewall rule set.
     *
     * @returns Returns the requested firewall zone name as published in the `ubus` runtime information or `null` if the remote protocol handler didn't request a zone.
     */
    getZoneName(): string | null;

    /**
     * Checks whether this interface is an alias interface.
     *
     * Alias interfaces are interfaces layering on top of another interface and are denoted by a special `@interfacename` notation in the underlying `ifname` option.
     *
     * @returns Returns the name of the parent interface if this logical interface is an alias or `null` if it is not an alias interface.
     */
    isAlias(): string | null;

    /**
     * Checks whether the underlying logical interface is declared as bridge.
     *
     * @returns Returns `true` when the interface is declared with `option type bridge` and when the associated protocol implementation is not marked virtual or `false` when the logical interface is no bridge.
     */
    isBridge(): boolean;

    /**
     * Check function for the protocol handler if a new interface is createable.
     *
     * This function should be overwritten by protocol specific subclasses.
     *
     * @param ifname - The name of the interface to be created.
     *
     * @returns Returns a promise resolving if new interface is createable, else rejects with an error message string.
     */
    abstract isCreateable(ifname: string): Promise<void>;

    /**
     * Checks whether this logical interface is dynamic.
     *
     * A dynamic interface is an interface which has been created at runtime, e.g. as sub-interface of another interface, but which is not backed by any user configuration. Such dynamic interfaces cannot be edited but only brought down or restarted.
     *
     * @returns Returns a boolean indicating whether this interface is dynamic (`true`) or not (`false`).
     */
    isDynamic(): boolean;

    /**
     * Checks whether this logical interface is "empty", meaning that ut has no network devices attached.
     *
     * @returns Returns `true` if this logical interface is empty, else `false`.
     */
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

  /**
   * A `Network.WifiDevice` class instance represents a wireless radio device present on the system and provides wireless capability information as well as methods for enumerating related wireless networks.
   */
  class WifiDevice extends baseclass {
    /**
     * Adds a new wireless network associated with this radio device to the configuration and sets its options to the provided values.
     *
     * @param options - The options to set for the newly added wireless network.
     *
     * @returns Returns a promise resolving to a `WifiNetwork` instance describing the newly added wireless network or `null` if the given options were invalid.
     */
    addWifiNetwork(options?: {
      [key: string]: string | string[];
    }): Promise<WifiNetwork | null>;

    /**
     * Deletes the wireless network with the given name associated with this radio device.
     *
     * @param network - The name of the wireless network to lookup. This may be either an uci configuration section ID, a network ID in the form `radio#.network#` or a Linux network device name like `wlan0` which is resolved to the corresponding configuration section through `ubus` runtime information.
     *
     * @returns Returns a promise resolving to `true` when the wireless network was successfully deleted from the configuration or `false` when the given network could not be found or if the found network was not associated with this wireless radio device.
     */
    deleteWifiNetwork(network: string): Promise<boolean>;

    /**
     * Read the given UCI option value of this wireless device.
     *
     * @param opt - The UCI option name to read.
     *
     * @returns Returns the UCI option value or `null` if the requested option is not found.
     */
    get(opt: string): string | string[] | null;

    /**
     * Gets a list of supported htmodes.
     *
     * The htmode values describe the wide-frequency options supported by the wireless phy.
     *
     * @returns Returns an array of valid htmode values for this radio. Currently known mode values are:
     * - `HT20` - applicable to IEEE 802.11n, 20 MHz wide channels
     * - `HT40` - applicable to IEEE 802.11n, 40 MHz wide channels
     * - `VHT20` - applicable to IEEE 802.11ac, 20 MHz wide channels
     * - `VHT40` - applicable to IEEE 802.11ac, 40 MHz wide channels
     * - `VHT80` - applicable to IEEE 802.11ac, 80 MHz wide channels
     * - `VHT160` - applicable to IEEE 802.11ac, 160 MHz wide channels
     */
    getHTModes(): (
      | "HT20"
      | "HT40"
      | "VHT20"
      | "VHT40"
      | "VHT80"
      | "VHT160"
      | string
    )[];

    /**
     * Gets a list of supported hwmodes.
     *
     * The hwmode values describe the frequency band and wireless standard versions supported by the wireless phy.
     *
     * @returns Returns an array of valid hwmode values for this radio. Currently known mode values are:
     * - `a` - Legacy 802.11a mode, 5 GHz, up to 54 Mbit/s
     * - `b` - Legacy 802.11b mode, 2.4 GHz, up to 11 Mbit/s
     * - `g` - Legacy 802.11g mode, 2.4 GHz, up to 54 Mbit/s
     * - `n` - IEEE 802.11n mode, 2.4 or 5 GHz, up to 600 Mbit/s
     * - `ac` - IEEE 802.11ac mode, 5 GHz, up to 6770 Mbit/s
     */
    getHWModes(): ("a" | "b" | "g" | "n" | "ac" | string)[];

    /**
     * Get a string describing the wireless radio hardware.
     *
     * @returns Returns the description string.
     */
    getI18n(): string;

    /**
     * Get the configuration name of this wireless radio.
     *
     * @returns Returns the UCI section name (e.g. `radio0`) of the corresponding radio configuration which also serves as unique logical identifier for the wireless phy.
     */
    getName(): string;

    /**
     * Trigger a wireless scan on this radio device and obtain a list of nearby networks.
     *
     * @returns Returns a promise resolving to an array of scan result objects describing the networks found in the vincinity.
     */
    getScanList(): Promise<WifiScanResult[]>;

    /**
     * Get the wifi network of the given name belonging to this radio device
     *
     * @param network - The name of the wireless network to lookup. This may be either an uci configuration section ID, a network ID in the form `radio#.network#` or a Linux network device name like `wlan0` which is resolved to the corresponding configuration section through `ubus` runtime information.
     *
     * @returns Returns a promise resolving to a `Network.WifiNetwork` instance representing the wireless network and rejecting with `null` if the given network could not be found or is not associated with this radio device.
     */
    getWifiNetwork(network: string): Promise<WifiNetwork>;

    /**
     * Get all wireless networks associated with this wireless radio device.
     *
     * @returns Returns a promise resolving to an array of `Network.WifiNetwork` instances respresenting the wireless networks associated with this radio device.
     */
    getWifiNetworks(): Promise<WifiNetwork[]>;

    /**
     * Checks whether this wireless radio is disabled.
     *
     * @returns Returns `true` when the wireless radio is marked as disabled in `ubus` runtime state or when the `disabled` option is set in the corresponding UCI configuration.
     */
    isDisabled(): boolean;

    /**
     * Check whether the wireless radio is marked as up in the `ubus` runtime state.
     *
     * @returns Returns `true` when the radio device is up, else `false`.
     */
    isUp(): boolean;

    /**
     * Set the given UCI option of this network to the given value.
     *
     * @param opt - The name of the UCI option to set.
     * @param val - The value to set or `null` to remove the given option from the configuration.
     */
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

    /**
     * Read the given UCI option value of this wireless network.
     *
     * @param opt - The UCI option name to read.
     *
     * @returns Returns the UCI option value or `null` if the requested option is not found.
     */
    get(opt: string): string | string[] | null;

    /**
     * Query the current BSSID from runtime information.
     *
     * @returns Returns the current BSSID or Mesh ID as reported by `ubus` runtime information.
     */
    getActiveBSSID(): string;

    /**
     * Query the current encryption settings from runtime information.
     *
     * @returns Returns a string describing the current encryption or `-` if the the encryption state could not be found in `ubus` runtime information.
     */
    getActiveEncryption(): string;

    /**
     * Query the current operation mode from runtime information.
     *
     * @returns Returns the human readable mode name as reported by `ubus` runtime state. Possible returned values are:
     * - `Master`
     * - `Ad-Hoc`
     * - `Client`
     * - `Monitor`
     * - `Master (VLAN)`
     * - `WDS`
     * - `Mesh Point`
     * - `P2P Client`
     * - `P2P Go`
     * - `Unknown`
     */
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

    /**
     * Query the current operation mode from runtime information as translated string.
     *
     * @returns Returns the translated, human readable mode name as reported by `ubus` runtime state.
     */
    getActiveModeI18n(): string;

    /**
     * Query the current SSID from runtime information.
     *
     * @returns Returns the current SSID or Mesh ID as reported by `ubus` runtime information.
     */
    getActiveSSID(): string;

    /**
     * Fetch the list of associated peers.
     *
     * @returns Returns a promise resolving to an array of wireless peers associated with this network.
     */
    getAssocList(): Promise<WifiPeerEntry[]>;

    /**
     * Query the current average bitrate of all peers associated to this wireless network.
     *
     * @returns Returns the average bit rate among all peers associated to the network as reported by `ubus` runtime information or `null` if the information is not available.
     */
    getBitRate(): number | null;

    /**
     * Get the configured BSSID of the wireless network.
     *
     * @returns Returns the BSSID value or `null` if none has been specified.
     */
    getBSSID(): string | null;

    /**
     * Query the current wireless channel.
     *
     * @returns Returns the wireless channel as reported by `ubus` runtime information or `null` if it cannot be determined.
     */
    getChannel(): number | null;

    /**
     * Query the current country code.
     *
     * @returns Returns the wireless country code as reported by `ubus` runtime information or `00` if it cannot be determined.
     */
    getCountryCode(): string;

    /**
     * Get the associated Linux network device.
     *
     * @returns Returns a `Network.Device` instance representing the Linux network device associted with this wireless network.
     */
    getDevice(): Device;

    /**
     * Query the current operating frequency of the wireless network.
     *
     * @returns Returns the current operating frequency of the network from `ubus` runtime information in GHz or `null` if the information is not available.
     */
    getFrequency(): string | null;

    /**
     * Get a description string for this wireless network.
     *
     * @returns Returns a string describing this network, consisting of the term `Wireless Network`, followed by the active operation mode, the SSID, BSSID or internal network ID and the Linux network device name, depending on which information is available.
     */
    getI18n(): string;

    /**
     * Get the internal network ID of this wireless network.
     *
     * The network ID is a LuCI specific identifer in the form `radio#.network#` to identify wireless networks by their corresponding radio and network index numbers.
     *
     * @returns Returns the LuCI specific network ID.
     */
    getID(): string;

    /**
     * Get the Linux network device name.
     *
     * @returns Returns the current Linux network device name as resolved from `ubus` runtime information or `null` if this network has no associated network device, e.g. when not configured or up.
     */
    getIfname(): string | null;

    /**
     * Get the configured Mesh ID of the wireless network.
     *
     * @returns Returns the configured mesh ID value or `null` when this network is not in mesh mode.
     */
    getMeshID(): string | null;

    /**
     * Get the configured operation mode of the wireless network.
     *
     * @returns Returns the configured operation mode. Possible values are:
     * - `ap` - Master (Access Point) mode
     * - `sta` - Station (client) mode
     * - `adhoc` - Ad-Hoc (IBSS) mode
     * - `mesh` - Mesh (IEEE 802.11s) mode
     * - `monitor` - Monitor mode
     */
    getMode(): "ap" | "sta" | "adhoc" | "mesh" | "monitor";

    /**
     * Get the configuration ID of this wireless network.
     *
     * @returns Returns the corresponding UCI section ID of the network.
     */
    getName(): string;

    /**
     * Get the primary logical interface this wireless network is attached to.
     *
     * @returns Returns a `Network.Protocol` instance representing the logical interface or `null` if this network is not attached to any logical interface.
     */
    getNetwork(): Protocol | null;

    /**
     * Get the names of the logical interfaces this wireless network is attached to.
     *
     * @returns Returns an array of logical interface names.
     */
    getNetworkNames(): string[];

    /**
     * Get the logical interfaces this wireless network is attached to.
     *
     * @returns Returns an array of `Network.Protocol` instances representing the logical interfaces this wireless network is attached to.
     */
    getNetworks(): Protocol[];

    /**
     * Query the current radio noise floor.
     *
     * @returns Returns the radio noise floor in dBm as reported by `ubus` runtime information or `0` if it cannot be determined.
     */
    getNoise(): number;

    /**
     * Get a short description string for this wireless network.
     *
     * @returns Returns a string describing this network, consisting of the active operation mode, followed by either the SSID, BSSID or internal network ID, depending on which information is available.
     */
    getShortName(): string;

    /**
     * Query the current wireless signal.
     *
     * @returns Returns the wireless signal in dBm as reported by `ubus` runtime information or `null` if it cannot be determined.
     */
    getSignal(): number | null;

    /**
     * Calculate the current signal.
     *
     * @returns Returns the calculated signal level, which is the difference between noise and signal (SNR), divided by 5.
     *
     * @deprecated Do not use.
     */
    getSignalLevel(): number;

    /**
     * Calculate the current signal quality percentage.
     *
     * @returns 	Returns the calculated signal quality in percent. The value is calculated from the `quality` and `quality_max` indicators reported by `ubus` runtime state.
     */
    getSignalPercent(): number;

    /**
     * Get the configured SSID of the wireless network.
     *
     * @returns Returns the configured SSID value or `null` when this network is in mesh mode.
     */
    getSSID(): string | null;

    /**
     * Query the current radio TX power.
     *
     * @returns Returns the wireless network transmit power in dBm as reported by `ubus` runtime information or `null` if it cannot be determined.
     */
    getTXPower(): number | null;

    /**
     * Query the radio TX power offset.
     *
     * Some wireless radios have a fixed power offset, e.g. due to the use of external amplifiers.
     *
     * @returns Returns the wireless network transmit power offset in dBm as reported by `ubus` runtime information or `0` if there is no offset, or if it cannot be determined.
     */
    getTXPowerOffset(): number;

    /**
     * Get the corresponding wifi radio device.
     *
     * @returns Returns a `Network.WifiDevice` instance representing the corresponding wifi radio device or `null` if the related radio device could not be found.
     */
    getWifiDevice(): WifiDevice | null;

    /**
     * Get the name of the corresponding wifi radio device.
     *
     * @returns Returns the name of the radio device this network is configured on or `null` if it cannot be determined.
     */
    getWifiDeviceName(): string | null;

    /**
     * Check whether this wifi network supports deauthenticating clients.
     *
     * @returns Returns `true` when this wifi network instance supports forcibly deauthenticating clients, otherwise `false`.
     */
    isClientDisconnectSupported(): boolean;

    /**
     * Checks whether this wireless network is disabled.
     *
     * @returns Returns `true` when the wireless radio is marked as disabled in `ubus` runtime state or when the `disabled` option is set in the corresponding UCI configuration.
     */
    isDisabled(): boolean;

    /**
     * Check whether the radio network is up.
     *
     * This function actually queries the up state of the related radio device and assumes this network to be up as well when the parent radio is up. This is due to the fact that OpenWrt does not control virtual interfaces individually but within one common hostapd instance.
     *
     * @returns Returns `true` when the network is up, else `false`.
     */
    isUp(): boolean;

    /**
     * Set the given UCI option of this network to the given value.
     *
     * @param opt - The name of the UCI option to set.
     * @param val - The value to set or `null` to remove the given option from the configuration.
     */
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
