declare namespace LuCI {
  namespace widgets {
    class DeviceSelect extends LuCI.form.ListValue {}

    class GroupSelect extends LuCI.form.ListValue {}

    class NetworkSelect extends LuCI.form.ListValue {}

    class UserSelect extends LuCI.form.ListValue {}

    class ZoneForwards extends LuCI.form.DummyValue {}

    class ZoneSelect extends LuCI.form.ListValue {
      lookupZone(name: string): LuCI.firewall.Zone | undefined;

      lookupNetwork(name: string): LuCI.network.Protocol | undefined;
    }
  }
}
