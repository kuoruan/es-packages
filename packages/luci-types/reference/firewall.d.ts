declare namespace LuCI {
  class firewall extends LuCI.baseclass {
    getDefaults(): Promise<LuCI.firewall.Defaults>;

    newZone(): Promise<LuCI.firewall.Zone | null>;

    addZone(): Promise<LuCI.firewall.Zone | null>;

    getZone(): Promise<LuCI.firewall.Zone | null>;

    getZones(): Promise<LuCI.firewall.Zone[]>;

    getZoneByNetwork(network: string): Promise<LuCI.firewall.Zone | null>;

    deleteZone(name: string): Promise<boolean>;

    renameZone(oldName: string, newName: string): Promise<boolean>;

    deleteNetwork(network: string): Promise<boolean>;

    getColorForName(name: string): string;
  }

  namespace firewall {
    class AbstractFirewallItem extends LuCI.baseclass {
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

      addRedirect(options?: Record<string, unknown>): Redirect;

      addRule(options?: Record<string, unknown>): Rule;

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
}
