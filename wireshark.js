/**
 * Copyright 2017 Nicholas Humfrey
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var os = require('os');

    function WiresharkNode(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        node.ifname = n.ifname;
        node.output = n.output || 'object';
        node.filter = n.filter || null;
        node.path = n.path;
        
        if (node.ifname) {

        }

        node.on("close", function() {
            try {
                // FIXME: kill process
                //if (node.session) {
                //node.session.close();
                //node.session = null;
                }
            } catch (err) {
                node.error(err);
            }
        });
    }
    RED.nodes.registerType("wireshark", WiresharkNode);

    RED.httpAdmin.get("/wireshark/interfaces", function(req, res) {
        var result = {};
        var interfaces = os.networkInterfaces();
        Object.keys(interfaces).forEach(function(ifname) {
            var mac = 'unknown';
            for(var key in interfaces[ifname]) {
                var address = interfaces[ifname][key];
                if (address['mac'] && address['mac'] != '00:00:00:00:00:00') {
                    mac = address.mac;
                    break;
                } else if (address['internal'] == true) {
                    mac = "Internal";
                }
            }
            result[ifname] = ifname + ' ('+mac+')';
        });

        res.send({
            'interfaces': result
        });
    });
};
