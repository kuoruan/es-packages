// Type definitions for tools.widgets.js
// Definitions by: Xingwang Liao <https://github.com/kuoruan>
// TypeScript Version: 3.8

import firewall from "./firewall";
import { DummyValue, ListValue } from "./form";
import network from "./network";

export as namespace widgets;
export = widgets;

declare namespace widgets {
  class DeviceSelect extends ListValue {}

  class GroupSelect extends ListValue {}

  class NetworkSelect extends ListValue {}

  class UserSelect extends ListValue {}

  class ZoneForwards extends DummyValue {}

  class ZoneSelect extends ListValue {
    lookupZone(name: string): firewall.Zone | undefined;

    lookupNetwork(name: string): network.Protocol | undefined;
  }
}
