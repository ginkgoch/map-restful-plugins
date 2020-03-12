# Map Plugins

Plugins allow to load customized map instances with you your plugin file. Follow the steps below to create your own plugins.

1. Copy `./plugins/plugin.js.template` as new name `plugin.js`. Rename the file but preserve the extension `.js`.
2. Run command `map-restful serve -e` to launch plugins.
3. Watch the log. If output includes `Plugin: map map-plugin loaded`, that means the plugins are loaded.