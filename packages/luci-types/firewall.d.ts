// Type definitions for firewall.js
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import baseclass from "./baseclass";

export as namespace firewall;
export = firewall;

declare namespace firewall {
  function getDefaults(): Promise<Defaults>;

  function newZone(): Promise<Zone | null>;

  function addZone(): Promise<Zone | null>;

  function getZone(): Promise<Zone | null>;

  function getZones(): Promise<Zone[]>;

  function getZoneByNetwork(network: string): Promise<Zone | null>;

  function deleteZone(name: string): Promise<boolean>;

  function renameZone(oldName: string, newName: string): Promise<boolean>;

  function deleteNetwork(network: string): Promise<boolean>;

  function getColorForName(name: string): string;

  class AbstractFirewallItem extends baseclass {
    get(option: string): string | string[] | null;

    set(option: string, value: string | string[] | null): void;
  }

  class Defaults extends AbstractFirewallItem {
    isSynFlood(): boolean;

    isDropInvalid(): boolean;

    getInput(): string | null;

    getOutput(): string | null;

    getForward(): string | null;
  }

  class Zone extends AbstractFirewallItem {
    isMasquerade(): boolean;

    getName(): string | null;

    getNetwork(): string | null;

    getInput(): string | null;

    getOutput(): string | null;

    getForward(): string | null;

    addNetwork(network: string): boolean;

    deleteNetwork(network: string): boolean;

    getNetworks(): string[];

    clearNetworks(): void;

    getDevices(): string[];

    getSubnets(): string[];

    getForwardingsBy(what: string): Forwarding[];

    addForwardingTo(dest: string): Forwarding | null;

    addForwardingFrom(src: string): Forwarding | null;

    deleteForwardingsBy(what: string): boolean;

    deleteForwarding(forwarding: Forwarding): boolean;

    addRedirect(options?: object): Redirect;

    addRule(options?: object): Rule;

    getColor(forName: string): string;
  }

  class Forwarding extends AbstractFirewallItem {
    getSource(): string | null;

    getDestination(): string | null;

    getSourceZone(): string | null;

    getDestinationZone(): string | null;
  }

  class Rule extends AbstractFirewallItem {
    getSource(): string | null;

    getDestination(): string | null;

    getSourceZone(): string | null;

    getDestinationZone(): string | null;
  }

  class Redirect extends AbstractFirewallItem {
    getSource(): string | null;

    getDestination(): string | null;

    getSourceZone(): string | null;

    getDestinationZone(): string | null;
  }
}
