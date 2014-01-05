var re = {
    connected: /^(\S+) connected (\d+)x(\d+)/,
    disconnected: /^(\S+) disconnected/,
    mode: /^\s+(\d+)x(\d+)\s+((?:\d+\.)?\d+)([* ]?)([+ ]?)/
};

module.exports = function (src) {
    var lines = src.split('\n');
    var query = {};
    var last = null;
    var index = 0;
    
    lines.forEach(function (line) {
        var m;
        if (m = re.connected.exec(line)) {
            query[m[1]] = {
                connected: true,
                width: parseInt(m[2]),
                height: parseInt(m[3]),
                modes: [],
                index: index++
            };
            last = m[1];
        }
        else if (m = re.disconnected.exec(line)) {
            query[m[1]] = {
                connected: false,
                modes: [],
                index: index++
            };
            last = m[1];
        }
        else if (last && (m = re.mode.exec(line))) {
            var r = {
                width: m[1],
                height: m[2],
                rate: parseFloat(m[3])
            };
            query[last].modes.push(r);
            
            if (m[4] === '*') query[last]['native'] = r;
            if (m[5] === '+') query[last].current = r;
        }
        else {
            last = null;
        }
    });
    return query;
};
