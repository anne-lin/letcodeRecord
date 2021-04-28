JSJAC_HAVEKEYS = true;          // whether to use keys
JSJAC_NKEYS = 16;            // number of keys to generate
JSJAC_INACTIVITY = 300;         // qnd hack to make suspend/resume
                                // work more smoothly with polling

JSJAC_ERR_COUNT = 10;           // number of retries in case of
                                // connection errors

JSJAC_ALLOW_PLAIN = true;       // whether to allow plaintext logins

JSJAC_ALLOW_SCRAM = false;      // allow usage of SCRAM-SHA-1
                                // authentication; please note that it
                                // is quite slow so it is disable by
                                // default

JSJAC_CHECKQUEUEINTERVAL = 100; // msecs to poll send queue
JSJAC_CHECKINQUEUEINTERVAL = 100; // msecs to poll incoming queue
JSJAC_TIMERVAL = 2000;          // default polling interval

JSJAC_RETRYDELAY = 5000;        // msecs to wait before trying next
                                // request after error

JSJAC_REGID_TIMEOUT = 20000;    // time in msec until registered
                                // callbacks for ids timeout

/* Options specific to HTTP Binding (BOSH) */
JSJACHBC_MAX_HOLD = 1;          // default for number of connctions
                                // held by connection manager

JSJACHBC_MAX_WAIT = 300;        // default 'wait' param - how long an
                                // idle connection should be held by
                                // connection manager

JSJACHBC_BOSH_VERSION = "1.10";
JSJACHBC_USE_BOSH_VER = true;

JSJACHBC_MAXPAUSE = 120;        // how long a suspend/resume cycle may
                                // take
JSJACPING_INTERVAL = 25000;
/*** END CONFIG ***/
var NS_DISCO_ITEMS = "http://jabber.org/protocol/disco#items";
var NS_DISCO_INFO = "http://jabber.org/protocol/disco#info";
var NS_VCARD = "vcard-temp";
var NS_VCARD_UPDATE = "vcard-temp:x:update";
var NS_AUTH = "jabber:iq:auth";
var NS_AUTH_ERROR = "jabber:iq:auth:error";
var NS_REGISTER = "jabber:iq:register";
var NS_SEARCH = "jabber:iq:search";
var NS_ROSTER = "jabber:iq:roster";
var NS_PRIVACY = "jabber:iq:privacy";
var NS_PRIVATE = "jabber:iq:private";
var NS_VERSION = "jabber:iq:version";
var NS_TIME = "jabber:iq:time";
var NS_TIME_NEW = "urn:xmpp:time";
var NS_LAST = "jabber:iq:last";
var NS_XDATA = "jabber:x:data";
var NS_IQDATA = "jabber:iq:data";
var NS_DELAY = "jabber:x:delay";
var NS_DELAY_NEW = "urn:xmpp:delay";
var NS_EXPIRE = "jabber:x:expire";
var NS_EVENT = "jabber:x:event";
var NS_XCONFERENCE = "jabber:x:conference";
var NS_PING = "urn:xmpp:ping";
var NS_BOOKSMARKS = "storage:bookmarks";
var NS_FORWARD_0 = "urn:xmpp:forward:0";
var NS_CARBONS_2 = "urn:xmpp:carbons:2";
var NS_CHAT_STATES = "http://jabber.org/protocol/chatstates";
var NS_STATS = "http://jabber.org/protocol/stats";
var NS_MUC = "http://jabber.org/protocol/muc";
var NS_MUC_USER = "http://jabber.org/protocol/muc#user";
var NS_MUC_ADMIN = "http://jabber.org/protocol/muc#admin";
var NS_MUC_OWNER = "http://jabber.org/protocol/muc#owner";
var NS_PUBSUB = "http://jabber.org/protocol/pubsub";
var NS_PUBSUB_EVENT = "http://jabber.org/protocol/pubsub#event";
var NS_PUBSUB_OWNER = "http://jabber.org/protocol/pubsub#owner";
var NS_PUBSUB_ERRORS = "http://jabber.org/protocol/pubsub#errors";
var NS_PUBSUB_NMI = "http://jabber.org/protocol/pubsub#node-meta-info";
var NS_COMMANDS = "http://jabber.org/protocol/commands";
var NS_CAPS = "http://jabber.org/protocol/caps";
var NS_STREAM = "http://etherx.jabber.org/streams";
var NS_FRAMING = "urn:ietf:params:xml:ns:xmpp-framing";
var NS_CLIENT = "jabber:client";
var NS_BOSH = "http://jabber.org/protocol/httpbind";
var NS_XBOSH = "urn:xmpp:xbosh";
var NS_STANZAS = "urn:ietf:params:xml:ns:xmpp-stanzas";
var NS_STREAMS = "urn:ietf:params:xml:ns:xmpp-streams";
var NS_TLS = "urn:ietf:params:xml:ns:xmpp-tls";
var NS_SASL = "urn:ietf:params:xml:ns:xmpp-sasl";
var NS_SESSION = "urn:ietf:params:xml:ns:xmpp-session";
var NS_BIND = "urn:ietf:params:xml:ns:xmpp-bind";
var NS_FEATURE_IQAUTH = "http://jabber.org/features/iq-auth";
var NS_FEATURE_IQREGISTER = "http://jabber.org/features/iq-register";
var NS_FEATURE_COMPRESS = "http://jabber.org/features/compress";
var NS_COMPRESS = "http://jabber.org/protocol/compress";

function STANZA_ERROR(c, b, a) {
    if (window == this) {
        return new STANZA_ERROR(c, b, a);
    }
    this.code = c;
    this.type = b;
    this.cond = a;
}

var ERR_BAD_REQUEST = STANZA_ERROR("400", "modify", "bad-request");
var ERR_CONFLICT = STANZA_ERROR("409", "cancel", "conflict");
var ERR_FEATURE_NOT_IMPLEMENTED = STANZA_ERROR("501", "cancel", "feature-not-implemented");
var ERR_FORBIDDEN = STANZA_ERROR("403", "auth", "forbidden");
var ERR_GONE = STANZA_ERROR("302", "modify", "gone");
var ERR_INTERNAL_SERVER_ERROR = STANZA_ERROR("500", "wait", "internal-server-error");
var ERR_ITEM_NOT_FOUND = STANZA_ERROR("404", "cancel", "item-not-found");
var ERR_JID_MALFORMED = STANZA_ERROR("400", "modify", "jid-malformed");
var ERR_NOT_ACCEPTABLE = STANZA_ERROR("406", "modify", "not-acceptable");
var ERR_NOT_ALLOWED = STANZA_ERROR("405", "cancel", "not-allowed");
var ERR_NOT_AUTHORIZED = STANZA_ERROR("401", "auth", "not-authorized");
var ERR_PAYMENT_REQUIRED = STANZA_ERROR("402", "auth", "payment-required");
var ERR_RECIPIENT_UNAVAILABLE = STANZA_ERROR("404", "wait", "recipient-unavailable");
var ERR_REDIRECT = STANZA_ERROR("302", "modify", "redirect");
var ERR_REGISTRATION_REQUIRED = STANZA_ERROR("407", "auth", "registration-required");
var ERR_REMOTE_SERVER_NOT_FOUND = STANZA_ERROR("404", "cancel", "remote-server-not-found");
var ERR_REMOTE_SERVER_TIMEOUT = STANZA_ERROR("504", "wait", "remote-server-timeout");
var ERR_RESOURCE_CONSTRAINT = STANZA_ERROR("500", "wait", "resource-constraint");
var ERR_SERVICE_UNAVAILABLE = STANZA_ERROR("503", "cancel", "service-unavailable");
var ERR_SUBSCRIPTION_REQUIRED = STANZA_ERROR("407", "auth", "subscription-required");
var ERR_UNEXPECTED_REQUEST = STANZA_ERROR("400", "wait", "unexpected-request");
var hexcase = 0;
var b64pad = "=";

function hex_sha1(a) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(a)));
}

function b64_sha1(a) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(a)));
}

function any_sha1(a, b) {
    return rstr2any(rstr_sha1(str2rstr_utf8(a)), b);
}

function hex_hmac_sha1(a, b) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(b)));
}

function b64_hmac_sha1(a, b) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(b)));
}

function any_hmac_sha1(a, c, b) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(a), str2rstr_utf8(c)), b);
}

function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}

function rstr_sha1(a) {
    return binb2rstr(binb_sha1(rstr2binb(a), a.length * 8));
}

function rstr_hmac_sha1(c, f) {
    var e = rstr2binb(c);
    if (e.length > 16) {
        e = binb_sha1(e, c.length * 8);
    }
    var a = Array(16), d = Array(16);
    for (var b = 0; b < 16; b++) {
        a[b] = e[b] ^ 909522486;
        d[b] = e[b] ^ 1549556828;
    }
    var g = binb_sha1(a.concat(rstr2binb(f)), 512 + f.length * 8);
    return binb2rstr(binb_sha1(d.concat(g), 512 + 160));
}

function rstr2binb(b) {
    var a = Array(b.length >> 2);
    for (var c = 0; c < a.length; c++) {
        a[c] = 0;
    }
    for (var c = 0; c < b.length * 8; c += 8) {
        a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (24 - c % 32);
    }
    return a;
}

function binb2rstr(b) {
    var a = "";
    for (var c = 0; c < b.length * 32; c += 8) {
        a += String.fromCharCode((b[c >> 5] >>> (24 - c % 32)) & 255);
    }
    return a;
}

function binb_sha1(v, o) {
    v[o >> 5] |= 128 << (24 - o % 32);
    v[((o + 64 >> 9) << 4) + 15] = o;
    var y = Array(80);
    var u = 1732584193;
    var s = -271733879;
    var r = -1732584194;
    var q = 271733878;
    var p = -1009589776;
    for (var l = 0; l < v.length; l += 16) {
        var n = u;
        var m = s;
        var k = r;
        var h = q;
        var f = p;
        for (var g = 0; g < 80; g++) {
            if (g < 16) {
                y[g] = v[l + g];
            } else {
                y[g] = bit_rol(y[g - 3] ^ y[g - 8] ^ y[g - 14] ^ y[g - 16], 1);
            }
            var z = safe_add(safe_add(bit_rol(u, 5), sha1_ft(g, s, r, q)), safe_add(safe_add(p, y[g]), sha1_kt(g)));
            p = q;
            q = r;
            r = bit_rol(s, 30);
            s = u;
            u = z;
        }
        u = safe_add(u, n);
        s = safe_add(s, m);
        r = safe_add(r, k);
        q = safe_add(q, h);
        p = safe_add(p, f);
    }
    return Array(u, s, r, q, p);
}

function sha1_ft(e, a, g, f) {
    if (e < 20) {
        return (a & g) | ((~a) & f);
    }
    if (e < 40) {
        return a ^ g ^ f;
    }
    if (e < 60) {
        return (a & g) | (a & f) | (g & f);
    }
    return a ^ g ^ f;
}

function sha1_kt(a) {
    return (a < 20) ? 1518500249 : (a < 40) ? 1859775393 : (a < 60) ? -1894007588 : -899497514;
}

function hex_md5(a) {
    return rstr2hex(rstr_md5(str2rstr_utf8(a)));
}

function b64_md5(a) {
    return rstr2b64(rstr_md5(str2rstr_utf8(a)));
}

function any_md5(a, b) {
    return rstr2any(rstr_md5(str2rstr_utf8(a)), b);
}

function hex_hmac_md5(a, b) {
    return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)));
}

function b64_hmac_md5(a, b) {
    return rstr2b64(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(b)));
}

function any_hmac_md5(a, c, b) {
    return rstr2any(rstr_hmac_md5(str2rstr_utf8(a), str2rstr_utf8(c)), b);
}

function md5_vm_test() {
    return hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
}

function rstr_md5(a) {
    return binl2rstr(binl_md5(rstr2binl(a), a.length * 8));
}

function rstr_hmac_md5(c, f) {
    var e = rstr2binl(c);
    if (e.length > 16) {
        e = binl_md5(e, c.length * 8);
    }
    var a = Array(16), d = Array(16);
    for (var b = 0; b < 16; b++) {
        a[b] = e[b] ^ 909522486;
        d[b] = e[b] ^ 1549556828;
    }
    var g = binl_md5(a.concat(rstr2binl(f)), 512 + f.length * 8);
    return binl2rstr(binl_md5(d.concat(g), 512 + 128));
}

function rstr2hex(c) {
    try {
        hexcase;
    } catch (g) {
        hexcase = 0;
    }
    var f = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var b = "";
    var a;
    for (var d = 0; d < c.length; d++) {
        a = c.charCodeAt(d);
        b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15);
    }
    return b;
}

function rstr2b64(c) {
    try {
        b64pad;
    } catch (h) {
        b64pad = "";
    }
    var g = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var b = "";
    var a = c.length;
    for (var f = 0; f < a; f += 3) {
        var k = (c.charCodeAt(f) << 16) | (f + 1 < a ? c.charCodeAt(f + 1) << 8 : 0) | (f + 2 < a ? c.charCodeAt(f + 2) : 0);
        for (var d = 0; d < 4; d++) {
            if (f * 8 + d * 6 > c.length * 8) {
                b += b64pad;
            } else {
                b += g.charAt((k >>> 6 * (3 - d)) & 63);
            }
        }
    }
    return b;
}

function rstr2any(m, c) {
    var b = c.length;
    var l, f, a, n, e;
    var k = Array(Math.ceil(m.length / 2));
    for (l = 0; l < k.length; l++) {
        k[l] = (m.charCodeAt(l * 2) << 8) | m.charCodeAt(l * 2 + 1);
    }
    var h = Math.ceil(m.length * 8 / (Math.log(c.length) / Math.log(2)));
    var g = Array(h);
    for (f = 0; f < h; f++) {
        e = Array();
        n = 0;
        for (l = 0; l < k.length; l++) {
            n = (n << 16) + k[l];
            a = Math.floor(n / b);
            n -= a * b;
            if (e.length > 0 || a > 0) {
                e[e.length] = a;
            }
        }
        g[f] = n;
        k = e;
    }
    var d = "";
    for (l = g.length - 1; l >= 0; l--) {
        d += c.charAt(g[l]);
    }
    return d;
}

function str2rstr_utf8(c) {
    var b = "";
    var d = -1;
    var a, e;
    while ( ++d < c.length ) {
        a = c.charCodeAt(d);
        e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
        if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
            a = 65536 + ((a & 1023) << 10) + (e & 1023);
            d++;
        }
        if (a <= 127) {
            b += String.fromCharCode(a);
        } else {
            if (a <= 2047) {
                b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63));
            } else {
                if (a <= 65535) {
                    b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63));
                } else {
                    if (a <= 2097151) {
                        b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63));
                    }
                }
            }
        }
    }
    return b;
}

function str2rstr_utf16le(b) {
    var a = "";
    for (var c = 0; c < b.length; c++) {
        a += String.fromCharCode(b.charCodeAt(c) & 255, (b.charCodeAt(c) >>> 8) & 255);
    }
    return a;
}

function str2rstr_utf16be(b) {
    var a = "";
    for (var c = 0; c < b.length; c++) {
        a += String.fromCharCode((b.charCodeAt(c) >>> 8) & 255, b.charCodeAt(c) & 255);
    }
    return a;
}

function rstr2binl(b) {
    var a = Array(b.length >> 2);
    for (var c = 0; c < a.length; c++) {
        a[c] = 0;
    }
    for (var c = 0; c < b.length * 8; c += 8) {
        a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32);
    }
    return a;
}

function binl2rstr(b) {
    var a = "";
    for (var c = 0; c < b.length * 32; c += 8) {
        a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255);
    }
    return a;
}

function binl_md5(p, k) {
    p[k >> 5] |= 128 << ((k) % 32);
    p[(((k + 64) >>> 9) << 4) + 14] = k;
    var o = 1732584193;
    var n = -271733879;
    var m = -1732584194;
    var l = 271733878;
    for (var g = 0; g < p.length; g += 16) {
        var j = o;
        var h = n;
        var f = m;
        var e = l;
        o = md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
        l = md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
        m = md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
        n = md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
        o = md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
        l = md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
        m = md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
        n = md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
        o = md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
        l = md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
        m = md5_ff(m, l, o, n, p[g + 10], 17, -42063);
        n = md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
        o = md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
        l = md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
        m = md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
        n = md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
        o = md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
        l = md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
        m = md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
        n = md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
        o = md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
        l = md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
        m = md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
        n = md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
        o = md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
        l = md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
        m = md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
        n = md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
        o = md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
        l = md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
        m = md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
        n = md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
        o = md5_hh(o, n, m, l, p[g + 5], 4, -378558);
        l = md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
        m = md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
        n = md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
        o = md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
        l = md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
        m = md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
        n = md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
        o = md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
        l = md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
        m = md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
        n = md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
        o = md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
        l = md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
        m = md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
        n = md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
        o = md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
        l = md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
        m = md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
        n = md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
        o = md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
        l = md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
        m = md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
        n = md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
        o = md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
        l = md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
        m = md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
        n = md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
        o = md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
        l = md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
        m = md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
        n = md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
        o = safe_add(o, j);
        n = safe_add(n, h);
        m = safe_add(m, f);
        l = safe_add(l, e);
    }
    return Array(o, n, m, l);
}

function md5_cmn(h, e, d, c, g, f) {
    return safe_add(bit_rol(safe_add(safe_add(e, h), safe_add(c, f)), g), d);
}

function md5_ff(g, f, k, j, e, i, h) {
    return md5_cmn((f & k) | ((~f) & j), g, f, e, i, h);
}

function md5_gg(g, f, k, j, e, i, h) {
    return md5_cmn((f & j) | (k & (~j)), g, f, e, i, h);
}

function md5_hh(g, f, k, j, e, i, h) {
    return md5_cmn(f ^ k ^ j, g, f, e, i, h);
}

function md5_ii(g, f, k, j, e, i, h) {
    return md5_cmn(k ^ (f | (~j)), g, f, e, i, h);
}

function safe_add(a, d) {
    var c = (a & 65535) + (d & 65535);
    var b = (a >> 16) + (d >> 16) + (c >> 16);
    return (b << 16) | (c & 65535);
}

function bit_rol(a, b) {
    return (a << b) | (a >>> (32 - b));
}

function utf8t2d(a) {
    a = a.replace(/\r\n/g, "\n");
    var b = new Array;
    var g = String.fromCharCode(237);
    if (g.charCodeAt(0) < 0) {
        for (var f = 0; f < a.length; f++) {
            var e = a.charCodeAt(f);
            if (e > 0) {
                b[b.length] = e;
            } else {
                b[b.length] = (((256 + e) >> 6) | 192);
                b[b.length] = (((256 + e) & 63) | 128);
            }
        }
    } else {
        for (var f = 0; f < a.length; f++) {
            var e = a.charCodeAt(f);
            if (e < 128) {
                b[b.length] = e;
            } else {
                if ((e > 127) && (e < 2048)) {
                    b[b.length] = ((e >> 6) | 192);
                    b[b.length] = ((e & 63) | 128);
                } else {
                    b[b.length] = ((e >> 12) | 224);
                    b[b.length] = (((e >> 6) & 63) | 128);
                    b[b.length] = ((e & 63) | 128);
                }
            }
        }
    }
    return b;
}

function utf8d2t(c) {
    var b = new Array;
    var a = 0;
    while ( a < c.length ) {
        if (c[a] < 128) {
            b[b.length] = String.fromCharCode(c[a]);
            a++;
        } else {
            if ((c[a] > 191) && (c[a] < 224)) {
                b[b.length] = String.fromCharCode(((c[a] & 31) << 6) | (c[a + 1] & 63));
                a += 2;
            } else {
                b[b.length] = String.fromCharCode(((c[a] & 15) << 12) | ((c[a + 1] & 63) << 6) | (c[a + 2] & 63));
                a += 3;
            }
        }
    }
    return b.join("");
}

function b64arrays() {
    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    b64 = new Array();
    f64 = new Array();
    for (var a = 0; a < b.length; a++) {
        b64[a] = b.charAt(a);
        f64[b.charAt(a)] = a;
    }
}

function b64d2t(f) {
    var e = new Array;
    var c = 0;
    var a = f.length;
    if ((a % 3) == 1) {
        f[f.length] = 0;
        f[f.length] = 0;
    }
    if ((a % 3) == 2) {
        f[f.length] = 0;
    }
    while ( c < f.length ) {
        e[e.length] = b64[f[c] >> 2];
        e[e.length] = b64[((f[c] & 3) << 4) | (f[c + 1] >> 4)];
        e[e.length] = b64[((f[c + 1] & 15) << 2) | (f[c + 2] >> 6)];
        e[e.length] = b64[f[c + 2] & 63];
        c += 3;
    }
    if ((a % 3) == 1) {
        e[e.length - 1] = e[e.length - 2] = "=";
    }
    if ((a % 3) == 2) {
        e[e.length - 1] = "=";
    }
    var b = e.join("");
    return b;
}

function b64t2d(b) {
    var c = new Array;
    var a = 0;
    b = b.replace(/\n|\r/g, "");
    b = b.replace(/=/g, "");
    while ( a < b.length ) {
        c[c.length] = (f64[b.charAt(a)] << 2) | (f64[b.charAt(a + 1)] >> 4);
        c[c.length] = (((f64[b.charAt(a + 1)] & 15) << 4) | (f64[b.charAt(a + 2)] >> 2));
        c[c.length] = (((f64[b.charAt(a + 2)] & 3) << 6) | (f64[b.charAt(a + 3)]));
        a += 4;
    }
    if (b.length % 4 == 2) {
        c = c.slice(0, c.length - 2);
    }
    if (b.length % 4 == 3) {
        c = c.slice(0, c.length - 1);
    }
    return c;
}

if (typeof (atob) == "undefined" || typeof (btoa) == "undefined") {
    b64arrays();
}
if (typeof (atob) == "undefined") {
    b64decode = function (a) {
        return utf8d2t(b64t2d(a));
    };
    b64decode_bin = function (c) {
        var d = b64t2d(c);
        var a = "";
        for (var b = 0; b < d.length; b++) {
            a += String.fromCharCode(d[b]);
        }
        return a;
    };
} else {
    b64decode = function (a) {
        return decodeURIComponent(escape(atob(a)));
    };
    b64decode_bin = atob;
}
if (typeof (btoa) == "undefined") {
    b64encode = function (a) {
        return b64d2t(utf8t2d(a));
    };
} else {
    b64encode = function (a) {
        return btoa(unescape(encodeURIComponent(a)));
    };
}

function XmlHttp() {
}

XmlHttp.create = function () {
    try {
        if (window.XMLHttpRequest) {
            var b = new XMLHttpRequest();
            if (b.readyState === null) {
                b.readyState = 1;
                b.addEventListener("load", function () {
                    b.readyState = 4;
                    if (typeof b.onreadystatechange == "function") {
                        b.onreadystatechange();
                    }
                }, false);
            }
            return b;
        }
        if (window.ActiveXObject) {
            return new ActiveXObject(XmlHttp.getPrefix() + ".XmlHttp");
        }
    } catch (a) {
    }
    throw new Error("Your browser does not support XmlHttp objects");
};
XmlHttp.getPrefix = function () {
    if (XmlHttp.prefix) {
        return XmlHttp.prefix;
    }
    var c = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
    var d;
    for (var b = 0; b < c.length; b++) {
        try {
            d = new ActiveXObject(c[b] + ".XmlHttp");
            return XmlHttp.prefix = c[b];
        } catch (a) {
        }
    }
    throw new Error("Could not find an installed XML parser");
};

function XmlDocument() {
}

XmlDocument.create = function (b, d) {
    b = b || "foo";
    d = d || "";
    try {
        var e;
        if (document.implementation && document.implementation.createDocument) {
            e = document.implementation.createDocument(d, b, null);
            if (e.readyState === null) {
                e.readyState = 1;
                e.addEventListener("load", function () {
                    e.readyState = 4;
                    if (typeof e.onreadystatechange == "function") {
                        e.onreadystatechange();
                    }
                }, false);
            }
        } else {
            if (window.ActiveXObject) {
                e = new ActiveXObject(XmlDocument.getPrefix() + ".DomDocument");
            }
        }
        if (!e.documentElement || e.documentElement.tagName != b || (e.documentElement.namespaceURI && e.documentElement.namespaceURI != d)) {
            try {
                if (d !== "") {
                    e.appendChild(e.createElement(b)).setAttribute("xmlns", d);
                } else {
                    e.appendChild(e.createElement(b));
                }
            } catch (a) {
                e = document.implementation.createDocument(d, b, null);
                if (e.documentElement === null) {
                    e.appendChild(e.createElement(b));
                }
                if (d !== "" && e.documentElement.getAttribute("xmlns") != d) {
                    e.documentElement.setAttribute("xmlns", d);
                }
            }
        }
        return e;
    } catch (c) {
    }
    throw new Error("Your browser does not support XmlDocument objects");
};
XmlDocument.getPrefix = function () {
    if (XmlDocument.prefix) {
        return XmlDocument.prefix;
    }
    var c = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
    var d;
    for (var b = 0; b < c.length; b++) {
        try {
            d = new ActiveXObject(c[b] + ".DomDocument");
            return XmlDocument.prefix = c[b];
        } catch (a) {
        }
    }
    throw new Error("Could not find an installed XML parser");
};
if (typeof (Document) != "undefined" && window.DOMParser) {
    Document.prototype.loadXML = function (b) {
        var c = (new DOMParser()).parseFromString(b, "text/xml");
        while ( this.hasChildNodes() ) {
            this.removeChild(this.lastChild);
        }
        for (var a = 0; a < c.childNodes.length; a++) {
            this.appendChild(this.importNode(c.childNodes[a], true));
        }
    };
}
if (window.XMLSerializer && window.Node && Node.prototype && Node.prototype.__defineGetter__) {
    XMLDocument.prototype.__defineGetter__("xml", function () {
        return (new XMLSerializer()).serializeToString(this);
    });
    Document.prototype.__defineGetter__("xml", function () {
        return (new XMLSerializer()).serializeToString(this);
    });
    Node.prototype.__defineGetter__("xml", function () {
        return (new XMLSerializer()).serializeToString(this);
    });
}
if (window.XDomainRequest) {
    window.ieXDRToXHR = function (b) {
        var a = b.XMLHttpRequest;
        b.XMLHttpRequest = function () {
            this.onreadystatechange = Object;
            this.xhr = null;
            this.xdr = null;
            this.readyState = 0;
            this.status = "";
            this.statusText = null;
            this.responseText = null;
            this.getResponseHeader = null;
            this.getAllResponseHeaders = null;
            this.setRequestHeader = null;
            this.abort = null;
            this.send = null;
            this.isxdr = false;
            var c = this;
            c.xdrLoadedBinded = function () {
                c.xdrLoaded();
            };
            c.xdrErrorBinded = function () {
                c.xdrError();
            };
            c.xdrProgressBinded = function () {
                c.xdrProgress();
            };
            c.xhrReadyStateChangedBinded = function () {
                c.xhrReadyStateChanged();
            };
        };
        XMLHttpRequest.prototype.open = function (h, d, e, c, f) {
            var g = document.createElement("a");
            g.href = d;
            if (g.hostname != document.domain) {
                if (this.xdr === null) {
                    this.xdr = new b.XDomainRequest();
                }
                this.isxdr = true;
                this.setXDRActive();
                this.xdr.open(h, d);
            } else {
                if (this.xhr === null) {
                    this.xhr = new a();
                }
                this.isxdr = false;
                this.setXHRActive();
                this.xhr.open(h, d, e, c, f);
            }
        };
        XMLHttpRequest.prototype.xdrGetResponseHeader = function (c) {
            if (c === "Content-Type" && this.xdr.contentType > "") {
                return this.xdr.contentType;
            }
            return "";
        };
        XMLHttpRequest.prototype.xdrGetAllResponseHeaders = function () {
            return (this.xdr.contentType > "") ? "Content-Type: " + this.xdr.contentType : "";
        };
        XMLHttpRequest.prototype.xdrSetRequestHeader = function (c, d) {
        };
        XMLHttpRequest.prototype.xdrLoaded = function () {
            if (this.onreadystatechange !== null) {
                this.readyState = 4;
                this.status = 200;
                this.statusText = "OK";
                this.responseText = this.xdr.responseText;
                if (b.ActiveXObject) {
                    var c = new ActiveXObject("Microsoft.XMLDOM");
                    c.async = "false";
                    c.loadXML(this.responseText);
                    this.responseXML = c;
                }
                this.onreadystatechange();
            }
        };
        XMLHttpRequest.prototype.xdrError = function () {
            if (this.onreadystatechange !== null) {
                this.readyState = 4;
                this.status = 0;
                this.statusText = "";
                this.responseText = "";
                this.onreadystatechange();
            }
        };
        XMLHttpRequest.prototype.xdrProgress = function () {
            if (this.onreadystatechange !== null && this.status !== 3) {
                this.readyState = 3;
                this.status = 3;
                this.statusText = "";
                this.onreadystatechange();
            }
        };
        XMLHttpRequest.prototype.finalXDRRequest = function () {
            var c = this.xdr;
            delete c.onload;
            delete c.onerror;
            delete c.onprogress;
        };
        XMLHttpRequest.prototype.sendXDR = function (d) {
            var c = this.xdr;
            c.onload = this.xdrLoadedBinded;
            c.onerror = this.xdr.ontimeout = this.xdrErrorBinded;
            c.onprogress = this.xdrProgressBinded;
            this.responseText = null;
            this.xdr.send(d);
        };
        XMLHttpRequest.prototype.abortXDR = function () {
            this.finalXDRRequest();
            this.xdr.abort();
        };
        XMLHttpRequest.prototype.setXDRActive = function () {
            this.send = this.sendXDR;
            this.abort = this.abortXDR;
            this.getResponseHeader = this.xdrGetResponseHeader;
            this.getAllResponseHeaders = this.xdrGetAllResponseHeaders;
            this.setRequestHeader = this.xdrSetRequestHeader;
        };
        XMLHttpRequest.prototype.xhrGetResponseHeader = function (c) {
            return this.xhr.getResponseHeader(c);
        };
        XMLHttpRequest.prototype.xhrGetAllResponseHeaders = function () {
            return this.xhr.getAllResponseHeaders();
        };
        XMLHttpRequest.prototype.xhrSetRequestHeader = function (c, d) {
            return this.xhr.setRequestHeader(c, d);
        };
        XMLHttpRequest.prototype.xhrReadyStateChanged = function () {
            if (this.onreadystatechange !== null && this.readyState !== this.xhr.readyState) {
                var c = this.xhr;
                this.readyState = c.readyState;
                if (this.readyState === 4) {
                    this.status = c.status;
                    this.statusText = c.statusText;
                    this.responseText = c.responseText;
                    this.responseXML = c.responseXML;
                    this.responseBody = c.responseBody;
                }
                this.onreadystatechange();
            }
        };
        XMLHttpRequest.prototype.finalXHRRequest = function () {
            delete this.xhr.onreadystatechange;
        };
        XMLHttpRequest.prototype.abortXHR = function () {
            this.finalXHRRequest();
            this.xhr.abort();
        };
        XMLHttpRequest.prototype.sendXHR = function (c) {
            this.xhr.onreadystatechange = this.xhrReadyStateChangedBinded;
            this.xhr.send(c);
        };
        XMLHttpRequest.prototype.setXHRActive = function () {
            this.send = this.sendXHR;
            this.abort = this.abortXHR;
            this.getResponseHeader = this.xhrGetResponseHeader;
            this.getAllResponseHeaders = this.xhrGetAllResponseHeaders;
            this.setRequestHeader = this.xhrSetRequestHeader;
        };
        b.ieXDRToXHR = undefined;
    };
    window.ieXDRToXHR(window);
}
String.prototype.htmlEnc = function () {
    if (!this) {
        return this;
    }
    var a = this.replace(/&/g, "&amp;");
    a = a.replace(/</g, "&lt;");
    a = a.replace(/>/g, "&gt;");
    a = a.replace(/\"/g, "&quot;");
    a = a.replace(/\n/g, "<br />");
    return a;
};
String.prototype.revertHtmlEnc = function () {
    if (!this) {
        return this;
    }
    var a = this.replace(/&amp;/gi, "&");
    a = a.replace(/&lt;/gi, "<");
    a = a.replace(/&gt;/gi, ">");
    a = a.replace(/&quot;/gi, '"');
    a = a.replace(/<br( )?(\/)?>/gi, "\n");
    return a;
};
Date.jab2date = function (b) {
    var a = new Date(Date.UTC(b.substr(0, 4), b.substr(5, 2) - 1, b.substr(8, 2), b.substr(11, 2), b.substr(14, 2), b.substr(17, 2)));
    if (b.substr(b.length - 6, 1) != "Z") {
        var c = new Date();
        c.setTime(0);
        c.setUTCHours(b.substr(b.length - 5, 2));
        c.setUTCMinutes(b.substr(b.length - 2, 2));
        if (b.substr(b.length - 6, 1) == "+") {
            a.setTime(a.getTime() - c.getTime());
        } else {
            if (b.substr(b.length - 6, 1) == "-") {
                a.setTime(a.getTime() + c.getTime());
            }
        }
    }
    return a;
};
Date.hrTime = function (a) {
    return Date.jab2date(a).toLocaleString();
};
Date.prototype.jabberDate = function () {
    var b = function (c) {
        if (c < 10) {
            return "0" + c;
        }
        return c;
    };
    var a = this.getUTCFullYear() + "-";
    a += b(this.getUTCMonth() + 1) + "-";
    a += b(this.getUTCDate()) + "T";
    a += b(this.getUTCHours()) + ":";
    a += b(this.getUTCMinutes()) + ":";
    a += b(this.getUTCSeconds()) + "Z";
    return a;
};
Number.max = function (a, b) {
    return (a > b) ? a : b;
};
Number.min = function (a, b) {
    return (a < b) ? a : b;
};
var JSJaC = {
    Version: "1.4", require: function (a) {
        document.write('<script type="text/javascript" src="' + a + '"><\/script>');
    }, load: function () {
        var c = ["xmlextras", "jsextras", "crypt", "JSJaCConfig", "JSJaCConstants", "JSJaCCookie", "JSJaCJSON", "JSJaCJID", "JSJaCUtils", "JSJaCBuilder", "JSJaCPacket", "JSJaCError", "JSJaCKeys", "JSJaCConnection", "JSJaCHttpPollingConnection", "JSJaCHttpBindingConnection", "JSJaCConsoleLogger", "JSJaCWebSocketConnection"];
        var a = document.getElementsByTagName("script");
        var d = "./", b;
        for (b = 0; b < a.length; b++) {
            if (a.item(b).src && a.item(b).src.match(/JSJaC\.js$/)) {
                d = a.item(b).src.replace(/JSJaC.js$/, "");
                break;
            }
        }
        for (b = 0; b < c.length; b++) {
            this.require(d + c[b] + ".js");
        }
    }, bind: function (b, c, a) {
        return function (d) {
            return b.apply(c, [d, a]);
        };
    }
};
if (typeof JSJaCConnection == "undefined") {
    JSJaC.load();
}
var JSJaCBuilder = {
    buildNode: function (e, b) {
        var c, d = arguments[4];
        if (arguments[2]) {
            if (JSJaCBuilder._isStringOrNumber(arguments[2]) || (arguments[2] instanceof Array)) {
                c = this._createElement(e, b, d);
                JSJaCBuilder._children(e, c, arguments[2]);
            } else {
                d = arguments[2]["xmlns"] || d;
                c = this._createElement(e, b, d);
                for (var a in arguments[2]) {
                    if (arguments[2].hasOwnProperty(a) && a != "xmlns") {
                        c.setAttribute(a, arguments[2][a]);
                    }
                }
            }
        } else {
            c = this._createElement(e, b, d);
        }
        if (arguments[3]) {
            JSJaCBuilder._children(e, c, arguments[3], d);
        }
        return c;
    }, _createElement: function (e, a, d) {
        try {
            if (d) {
                return e.createElementNS(d, a);
            }
        } catch (b) {
        }
        var c = e.createElement(a);
        if (d) {
            c.setAttribute("xmlns", d);
        }
        return c;
    }, _text: function (a, b) {
        return a.createTextNode(b);
    }, _children: function (h, c, b, d) {
        if (typeof b == "object") {
            for (var a in b) {
                if (b.hasOwnProperty(a)) {
                    var g = b[a];
                    if (typeof g == "object") {
                        if (g instanceof Array) {
                            var f = JSJaCBuilder.buildNode(h, g[0], g[1], g[2], d);
                            c.appendChild(f);
                        } else {
                            c.appendChild(g);
                        }
                    } else {
                        if (JSJaCBuilder._isStringOrNumber(g)) {
                            c.appendChild(JSJaCBuilder._text(h, g));
                        }
                    }
                }
            }
        } else {
            if (JSJaCBuilder._isStringOrNumber(b)) {
                c.appendChild(JSJaCBuilder._text(h, b));
            }
        }
    }, _attributes: function (a) {
        var b = [];
        for (var c in a) {
            if (a.hasOwnProperty(c)) {
                b.push(c + '="' + a[c].toString().htmlEnc() + '"');
            }
        }
        return b.join(" ");
    }, _isStringOrNumber: function (a) {
        return (typeof a == "string" || typeof a == "number");
    }
};

function JSJaCConnection(a) {
    if (a && a.httpbase) {
        this._httpbase = a.httpbase;
    }
    if (a && a.oDbg && a.oDbg.log) {
        this.oDbg = a.oDbg;
    } else {
        this.oDbg = {
            log: function () {
            }
        };
    }
    if (a && a.timerval) {
        this.setPollInterval(a.timerval);
    } else {
        this.setPollInterval(JSJAC_TIMERVAL);
    }
    if (a && a.cookie_prefix) {
        this._cookie_prefix = a.cookie_prefix;
    } else {
        this._cookie_prefix = "";
    }
    this._connected = false;
    this._events = [];
    this._keys = null;
    this._ID = 0;
    this._inQ = [];
    this._pQueue = [];
    this._regIDs = [];
    this._req = [];
    this._status = "intialized";
    this._errcnt = 0;
    this._inactivity = JSJAC_INACTIVITY;
    this._sendRawCallbacks = [];
}

JSJaCConnection.prototype.connect = function (a) {
    this._setStatus("connecting");
    this.domain = a.domain || "localhost";
    this.username = a.username;
    this.resource = a.resource;
    this.pass = a.password || a.pass;
    this.authzid = a.authzid || "";
    this.register = a.register;
    this.authhost = a.authhost || a.host || a.domain;
    this.authtype = a.authtype || "sasl";
    if (a.xmllang && a.xmllang !== "") {
        this._xmllang = a.xmllang;
    } else {
        this._xmllang = "en";
    }
    if (a.allow_plain) {
        this._allow_plain = a.allow_plain;
    } else {
        this._allow_plain = JSJAC_ALLOW_PLAIN;
    }
    if (a.allow_scram) {
        this._allow_scram = a.allow_scram;
    } else {
        this._allow_scram = JSJAC_ALLOW_SCRAM;
    }
    this.host = a.host;
    this.port = a.port || 5222;
    this.jid = this.username + "@" + this.domain;
    this.fulljid = this.jid + "/" + this.resource;
    this._rid = Math.round(100000.5 + (((900000.49999) - (100000.5)) * Math.random()));
    var c = this._getFreeSlot();
    this._req[c] = this._setupRequest(true);
    var b = this._getInitialRequestString();
    this.oDbg.log(b, 4);
    this._req[c].r.onreadystatechange = JSJaC.bind(function () {
        var d = this._req[c].r;
        if (d.readyState == 4) {
            this.oDbg.log("async recv: " + d.responseText, 4);
            this._handleInitialResponse(d);
        }
    }, this);
    if (typeof (this._req[c].r.onerror) != "undefined") {
        this._req[c].r.onerror = JSJaC.bind(function () {
            this.oDbg.log("XmlHttpRequest error", 1);
        }, this);
    }
    this._req[c].r.send(b);
};
JSJaCConnection.prototype.connected = function () {
    return this._connected;
};
JSJaCConnection.prototype.disconnect = function () {
    this._setStatus("disconnecting");
    if (!this.connected()) {
        return;
    }
    this._connected = false;
    clearInterval(this._interval);
    clearInterval(this._inQto);
    if (this._timeout) {
        clearTimeout(this._timeout);
    }
    var c = this._getFreeSlot();
    this._req[c] = this._setupRequest(false);
    var a = this._getRequestString(false, true);
    this.oDbg.log("Disconnecting: " + a, 4);
    try {
        this._req[c].r.send(a);
    } catch (b) {
    }
    this.oDbg.log("disconnected");
    try {
        JSJaCCookie.read(this._cookie_prefix + "JSJaC_State").erase();
    } catch (b) {
    }
    this._handleEvent("ondisconnect");
};
JSJaCConnection.prototype.getPollInterval = function () {
    return this._timerval;
};
JSJaCConnection.prototype.registerHandler = function (b) {
    b = b.toLowerCase();
    var a = { handler: arguments[arguments.length - 1], childName: "*", childNS: "*", type: "*" };
    if (arguments.length > 2) {
        a.childName = arguments[1];
    }
    if (arguments.length > 3) {
        a.childNS = arguments[2];
    }
    if (arguments.length > 4) {
        a.type = arguments[3];
    }
    if (!this._events[b]) {
        this._events[b] = [a];
    } else {
        this._events[b] = this._events[b].concat(a);
    }
    this._events[b] = this._events[b].sort(function (e, d) {
        var f = 0;
        var c = 0;
        if (e.type == "*") {
            f++;
        }
        if (e.childNS == "*") {
            f++;
        }
        if (e.childName == "*") {
            f++;
        }
        if (d.type == "*") {
            c++;
        }
        if (d.childNS == "*") {
            c++;
        }
        if (d.childName == "*") {
            c++;
        }
        if (f > c) {
            return 1;
        }
        if (f < c) {
            return -1;
        }
        return 0;
    });
    this.oDbg.log("registered handler for event '" + b + "'", 2);
    return this;
};
JSJaCConnection.prototype.unregisterHandler = function (e, d) {
    e = e.toLowerCase();
    if (!this._events[e]) {
        return this;
    }
    var a = this._events[e], c = [];
    for (var b = 0; b < a.length; b++) {
        if (a[b].handler != d) {
            c.push(a[b]);
        }
    }
    if (a.length != c.length) {
        this._events[e] = c;
        this.oDbg.log("unregistered handler for event '" + e + "'", 2);
    }
    return this;
};
JSJaCConnection.prototype.registerIQGet = function (a, b, c) {
    return this.registerHandler("iq", a, b, "get", c);
};
JSJaCConnection.prototype.registerIQSet = function (a, b, c) {
    return this.registerHandler("iq", a, b, "set", c);
};
JSJaCConnection.prototype.resume = function () {
    try {
        var a = JSJaCCookie.read(this._cookie_prefix + "JSJaC_State").getValue();
        this.oDbg.log("read cookie: " + a, 2);
        JSJaCCookie.read(this._cookie_prefix + "JSJaC_State").erase();
        return this.resumeFromData(JSJaCJSON.parse(a));
    } catch (b) {
    }
    return false;
};
JSJaCConnection.prototype.resumeFromData = function (d) {
    try {
        for (var c in d) {
            if (d.hasOwnProperty(c)) {
                this[c] = d[c];
            }
        }
        if (this._keys) {
            this._keys2 = new JSJaCKeys();
            var b = this._keys2._getSuspendVars();
            for (var a = 0; a < b.length; a++) {
                this._keys2[b[a]] = this._keys[b[a]];
            }
            this._keys = this._keys2;
        }
        if (this._connected) {
            this._setStatus("resuming");
            this._handleEvent("onresume");
            setTimeout(JSJaC.bind(this._resume, this), this.getPollInterval());
            this._interval = setInterval(JSJaC.bind(this._checkQueue, this), JSJAC_CHECKQUEUEINTERVAL);
            this._inQto = setInterval(JSJaC.bind(this._checkInQ, this), JSJAC_CHECKINQUEUEINTERVAL);
        } else {
            this._setStatus("terminated");
        }
        return (this._connected === true);
    } catch (f) {
        if (f.message) {
            this.oDbg.log("Resume failed: " + f.message, 1);
        } else {
            this.oDbg.log("Resume failed: " + f, 1);
        }
        return false;
    }
};
JSJaCConnection.prototype.send = function (c, b, a) {
    if (!c || !c.pType) {
        this.oDbg.log("no packet: " + c, 1);
        return false;
    }
    if (!this.connected()) {
        return false;
    }
    if (b) {
        if (!c.getID()) {
            c.setID("JSJaCID_" + this._ID++);
        }
        this._registerPID(c, b, a);
    }
    this._pQueue = this._pQueue.concat(c.xml());
    this._handleEvent(c.pType() + "_out", c);
    this._handleEvent("packet_out", c);
    return true;
};
JSJaCConnection.prototype.sendIQ = function (e, c, a) {
    if (!e || e.pType() != "iq") {
        return false;
    }
    c = c || {};
    var b = c.error_handler || JSJaC.bind(function (g) {
        this.oDbg.log(g.xml(), 1);
    }, this);
    var d = c.result_handler || JSJaC.bind(function (g) {
        this.oDbg.log(g.xml(), 2);
    }, this);
    var f = function (h, g) {
        switch ( h.getType() ) {
            case"error":
                b(h);
                break;
            case"result":
                d(h, g);
                break;
        }
    };
    return this.send(e, f, a);
};
JSJaCConnection.prototype.setPollInterval = function (a) {
    if (a && !isNaN(a)) {
        this._timerval = a;
    }
    return this._timerval;
};
JSJaCConnection.prototype.status = function () {
    return this._status;
};
JSJaCConnection.prototype.suspend = function () {
    var b = this.suspendToData();
    try {
        var f = new JSJaCCookie(this._cookie_prefix + "JSJaC_State", JSJaCJSON.toString(b));
        this.oDbg.log("writing cookie: " + f.getValue() + "\n(length:" + f.getValue().length + ")", 2);
        f.write();
        var a = JSJaCCookie.get(this._cookie_prefix + "JSJaC_State");
        if (f.getValue() != a) {
            this.oDbg.log("Suspend failed writing cookie.\nread: " + a, 1);
            f.erase();
            return false;
        }
        return true;
    } catch (d) {
        this.oDbg.log("Failed creating cookie '" + this._cookie_prefix + "JSJaC_State': " + d.message, 1);
    }
    return false;
};
JSJaCConnection.prototype.suspendToData = function () {
    clearTimeout(this._timeout);
    clearInterval(this._interval);
    clearInterval(this._inQto);
    this._suspend();
    var c = ("_connected,_keys,_ID,_xmllang,_inQ,_pQueue,_regIDs,_errcnt,_inactivity,domain,username,resource,jid,fulljid,_sid,_httpbase,_timerval,_is_polling").split(",");
    c = c.concat(this._getSuspendVars());
    var e = {};
    for (var d = 0; d < c.length; d++) {
        if (!this[c[d]]) {
            continue;
        }
        var f = {};
        if (this[c[d]]._getSuspendVars) {
            var a = this[c[d]]._getSuspendVars();
            for (var b = 0; b < a.length; b++) {
                f[a[b]] = this[c[d]][a[b]];
            }
        } else {
            f = this[c[d]];
        }
        e[c[d]] = f;
    }
    this._connected = false;
    this._setStatus("suspending");
    return e;
};
JSJaCConnection.prototype._abort = function () {
    clearTimeout(this._timeout);
    clearInterval(this._inQto);
    clearInterval(this._interval);
    this._connected = false;
    this._setStatus("aborted");
    this.oDbg.log("Disconnected.", 1);
    this._handleEvent("ondisconnect");
    this._handleEvent("onerror", JSJaCError("500", "cancel", "service-unavailable"));
};
JSJaCConnection.prototype._checkInQ = function () {
    for (var a = 0; a < this._inQ.length && a < 10; a++) {
        var b = this._inQ[0];
        this._inQ = this._inQ.slice(1, this._inQ.length);
        var c = JSJaCPacket.wrapNode(b);
        if (!c) {
            return;
        }
        this._handleEvent("packet_in", c);
        if (c.pType && !this._handlePID(c)) {
            this._handleEvent(c.pType() + "_in", c);
            this._handleEvent(c.pType(), c);
        }
    }
};
JSJaCConnection.prototype._checkQueue = function () {
    if (this._pQueue.length > 0) {
        this._process();
    }
    return true;
};
JSJaCConnection.prototype._doAuth = function () {
    if (this.has_sasl && this.authtype == "nonsasl") {
        this.oDbg.log("Warning: SASL present but not used", 1);
    }
    if (!this._doSASLAuth() && !this._doLegacyAuth()) {
        this.oDbg.log("Auth failed for authtype " + this.authtype, 1);
        this.disconnect();
        return false;
    }
    return true;
};
JSJaCConnection.prototype._doInBandReg = function () {
    if (this.authtype == "saslanon" || this.authtype == "anonymous") {
        return;
    }
    var a = new JSJaCIQ();
    a.setType("set");
    a.setID("reg1");
    a.appendNode("query", { xmlns: NS_REGISTER }, [["username", this.username], ["password", this.pass]]);
    this.send(a, this._doInBandRegDone);
};
JSJaCConnection.prototype._doInBandRegDone = function (a) {
    if (a && a.getType() == "error") {
        this.oDbg.log("registration failed for " + this.username, 0);
        this._handleEvent("onerror", a.getChild("error"));
        return;
    }
    this.oDbg.log(this.username + " registered succesfully", 0);
    this._doAuth();
};
JSJaCConnection.prototype._doLegacyAuth = function () {
    if (this.authtype != "nonsasl" && this.authtype != "anonymous") {
        return false;
    }
    var a = new JSJaCIQ();
    a.setIQ(null, "get", "auth1");
    a.appendNode("query", { xmlns: NS_AUTH }, [["username", this.username]]);
    this.send(a, this._doLegacyAuth2);
    return true;
};
JSJaCConnection.prototype._doLegacyAuth2 = function (d) {
    if (!d || d.getType() != "result") {
        if (d && d.getType() == "error") {
            this._handleEvent("onerror", d.getChild("error"));
        }
        this.disconnect();
        return;
    }
    var a = (d.getChild("digest") !== null);
    var c = new JSJaCIQ();
    c.setIQ(null, "set", "auth2");
    var b = c.appendNode("query", { xmlns: NS_AUTH }, [["username", this.username], ["resource", this.resource]]);
    if (a) {
        b.appendChild(c.buildNode("digest", { xmlns: NS_AUTH }, hex_sha1(this.streamid + this.pass)));
    } else {
        if (this._allow_plain) {
            b.appendChild(c.buildNode("password", { xmlns: NS_AUTH }, this.pass));
        } else {
            this.oDbg.log("no valid login mechanism found", 1);
            this.disconnect();
            return;
        }
    }
    this.send(c, this._doLegacyAuthDone);
};
JSJaCConnection.prototype._doLegacyAuthDone = function (a) {
    if (a.getType() != "result") {
        if (a.getType() == "error") {
            this._handleEvent("onerror", a.getChild("error"));
        }
        this.disconnect();
    } else {
        this._handleEvent("onconnect");
    }
};
JSJaCConnection.prototype._doSASLAuth = function () {
    if (this.authtype == "nonsasl" || this.authtype == "anonymous") {
        return false;
    }
    if (this.authtype == "saslanon") {
        if (this.mechs.ANONYMOUS) {
            this.oDbg.log("SASL using mechanism 'ANONYMOUS'", 2);
            return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='ANONYMOUS'/>", this._doSASLAuthDone);
        }
        this.oDbg.log("SASL ANONYMOUS requested but not supported", 1);
    } else {
        if (this._allow_scram && this.mechs["SCRAM-SHA-1"]) {
            this.oDbg.log("SASL using mechanism 'SCRAM-SHA-1'", 2);
            this._clientFirstMessageBare = "n=" + this.username.replace(/=/g, "=3D").replace(/,/g, "=2C") + ",r=" + JSJaCUtils.cnonce(16);
            var b;
            if (this.authzid) {
                b = "n,a=" + this.authzid.replace(/=/g, "=3D").replace(/,/g, "=2C") + ",";
            } else {
                b = "n,,";
            }
            var a = b + this._clientFirstMessageBare;
            return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='SCRAM-SHA-1'>" + b64encode(a) + "</auth>", this._doSASLAuthScramSha1S1);
        } else {
            if (this.mechs["DIGEST-MD5"]) {
                this.oDbg.log("SASL using mechanism 'DIGEST-MD5'", 2);
                return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='DIGEST-MD5'/>", this._doSASLAuthDigestMd5S1);
            } else {
                if (this._allow_plain && this.mechs.PLAIN) {
                    this.oDbg.log("SASL using mechanism 'PLAIN'", 2);
                    var c = this.authzid + String.fromCharCode(0) + this.username + String.fromCharCode(0) + this.pass;
                    this.oDbg.log("authenticating with '" + c + "'", 2);
                    c = b64encode(c);
                    return this._sendRaw("<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + c + "</auth>", this._doSASLAuthDone);
                }
            }
        }
        this.oDbg.log("No SASL mechanism applied", 1);
        this.authtype = "nonsasl";
    }
    return false;
};
JSJaCConnection.prototype._doSASLAuthScramSha1S1 = function (d) {
    if (d.nodeName != "challenge") {
        this.oDbg.log("challenge missing", 1);
        this._handleEvent("onerror", JSJaCError("401", "auth", "not-authorized"));
        this.disconnect();
    } else {
        var f = b64decode(d.firstChild.nodeValue);
        this.oDbg.log("got challenge: " + f, 2);
        var t = {};
        var n = f.split(",");
        for (var c in n) {
            if (n.hasOwnProperty(c)) {
                var v = n[c].substring(2);
                t[n[c].substring(0, 1)] = v;
            }
        }
        var b = str2rstr_utf8(this.pass);
        var l = b64decode_bin(t.s) + "\x00\x00\x00\x01";
        var r, p = parseInt(t.i, 10);
        for (var o = 0; o < p; o++) {
            l = rstr_hmac_sha1(b, l);
            r = JSJaCUtils.xor(r, l);
        }
        var s;
        if (this.authzid) {
            s = "n,a=" + this.authzid.replace(/=/g, "=3D").replace(/,/g, "=2C") + ",";
        } else {
            s = "n,,";
        }
        var k = "c=" + b64encode(s) + ",r=" + t.r;
        this._saltedPassword = r;
        var a = rstr_hmac_sha1(this._saltedPassword, "Client Key");
        var m = rstr_sha1(a);
        this._authMessage = this._clientFirstMessageBare + "," + f + "," + k;
        var q = rstr_hmac_sha1(m, str2rstr_utf8(this._authMessage));
        var e = JSJaCUtils.xor(a, q);
        var g = k + ",p=" + rstr2b64(e);
        this.oDbg.log("response: " + g, 2);
        this._sendRaw("<response xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>" + b64encode(g) + "</response>", this._doSASLAuthScramSha1S2);
    }
};
JSJaCConnection.prototype._doSASLAuthScramSha1S2 = function (a) {
    if (a.nodeName != "success") {
        this.oDbg.log("auth failed", 1);
        this._handleEvent("onerror", JSJaCError("401", "auth", "not-authorized"));
        this.disconnect();
    } else {
        var d = b64decode(a.firstChild.nodeValue);
        this.oDbg.log("got success: " + d, 2);
        var c = {};
        var f = d.split(",");
        for (var h in f) {
            if (f.hasOwnProperty(h)) {
                var b = f[h].substring(2);
                c[f[h].substring(0, 1)] = b;
            }
        }
        var i = rstr_hmac_sha1(this._saltedPassword, "Server Key");
        var e = rstr_hmac_sha1(i, str2rstr_utf8(this._authMessage));
        var g = b64decode_bin(c.v);
        if (e !== g) {
            this.oDbg.log("server auth failed", 1);
            this._handleEvent("onerror", JSJaCError("401", "auth", "not-authorized"));
            this.disconnect();
        } else {
            this._reInitStream(JSJaC.bind(this._doStreamBind, this));
        }
    }
};
JSJaCConnection.prototype._doSASLAuthDigestMd5S1 = function (c) {
    if (c.nodeName != "challenge") {
        this.oDbg.log("challenge missing", 1);
        this._handleEvent("onerror", JSJaCError("401", "auth", "not-authorized"));
        this.disconnect();
    } else {
        var i = b64decode(c.firstChild.nodeValue), g;
        this.oDbg.log("got challenge: " + i, 2);
        g = i.indexOf('nonce="');
        if (g !== -1) {
            this._nonce = i.substring(g + 7);
            this._nonce = this._nonce.substring(0, this._nonce.indexOf('"'));
            this.oDbg.log("nonce: " + this._nonce, 2);
        } else {
            this.oDbg.log("no valid nonce found, aborting", 1);
            this.disconnect();
            return;
        }
        g = i.indexOf('realm="');
        if (g !== -1) {
            this._realm = i.substring(g + 7);
            this._realm = this._realm.substring(0, this._realm.indexOf('"'));
        }
        this._realm = this._realm || this.domain;
        this.oDbg.log("realm: " + this._realm, 2);
        this._digest_uri = "xmpp/" + this.domain;
        this._cnonce = JSJaCUtils.cnonce(14);
        this._nc = "00000001";
        var b = this.username + ":" + this._realm + ":" + this.pass;
        var a = rstr_md5(str2rstr_utf8(b));
        var e = a + ":" + this._nonce + ":" + this._cnonce;
        if (this.authzid) {
            e = e + ":" + this.authzid;
        }
        var k = rstr2hex(rstr_md5(e));
        var d = "AUTHENTICATE:" + this._digest_uri;
        var j = hex_md5(d);
        var f = hex_md5(k + ":" + this._nonce + ":" + this._nc + ":" + this._cnonce + ":auth:" + j);
        var h = 'username="' + this.username + '",realm="' + this._realm + '",nonce="' + this._nonce + '",cnonce="' + this._cnonce + '",nc=' + this._nc + ',qop=auth,digest-uri="' + this._digest_uri + '",response=' + f + ",charset=utf-8";
        if (this.authzid) {
            h = 'authzid="' + this.authzid + '",' + h;
        }
        this.oDbg.log("response: " + h, 2);
        this._sendRaw("<response xmlns='urn:ietf:params:xml:ns:xmpp-sasl'>" + b64encode(h) + "</response>", this._doSASLAuthDigestMd5S2);
    }
};
JSJaCConnection.prototype._doSASLAuthDigestMd5S2 = function (c) {
    if (c.nodeName == "failure") {
        if (c.xml) {
            this.oDbg.log("auth error: " + c.xml, 1);
        } else {
            this.oDbg.log("auth error", 1);
        }
        this._handleEvent("onerror", JSJaCError("401", "auth", "not-authorized"));
        this.disconnect();
        return;
    }
    var f = b64decode(c.firstChild.nodeValue);
    this.oDbg.log("response: " + f, 2);
    var g = f.substring(f.indexOf("rspauth=") + 8);
    this.oDbg.log("rspauth: " + g, 2);
    var b = this.username + ":" + this._realm + ":" + this.pass;
    var a = rstr_md5(str2rstr_utf8(b));
    var e = a + ":" + this._nonce + ":" + this._cnonce;
    if (this.authzid) {
        e = e + ":" + this.authzid;
    }
    var i = rstr2hex(rstr_md5(e));
    var d = ":" + this._digest_uri;
    var h = hex_md5(d);
    var j = hex_md5(i + ":" + this._nonce + ":" + this._nc + ":" + this._cnonce + ":auth:" + h);
    this.oDbg.log("rsptest: " + j, 2);
    if (j != g) {
        this.oDbg.log("SASL Digest-MD5: server repsonse with wrong rspauth", 1);
        this.disconnect();
        return;
    }
    if (c.nodeName == "success") {
        this._reInitStream(JSJaC.bind(this._doStreamBind, this));
    } else {
        this._sendRaw("<response xmlns='urn:ietf:params:xml:ns:xmpp-sasl'/>", this._doSASLAuthDone);
    }
};
JSJaCConnection.prototype._doSASLAuthDone = function (a) {
    if (a.nodeName != "success") {
        this.oDbg.log("auth failed", 1);
        this._handleEvent("onerror", JSJaCError("401", "auth", "not-authorized"));
        this.disconnect();
    } else {
        this._reInitStream(JSJaC.bind(this._doStreamBind, this));
    }
};
JSJaCConnection.prototype._doStreamBind = function () {
    var a = new JSJaCIQ();
    a.setIQ(null, "set", "bind_1");
    a.appendNode("bind", { xmlns: NS_BIND }, [["resource", this.resource]]);
    this.oDbg.log(a.xml());
    this.send(a, this._doXMPPSess);
};
JSJaCConnection.prototype._doXMPPSess = function (a) {
    if (a.getType() != "result" || a.getType() == "error") {
        this.disconnect();
        if (a.getType() == "error") {
            this._handleEvent("onerror", a.getChild("error"));
        }
        return;
    }
    this.fulljid = a.getChildVal("jid");
    this.jid = this.fulljid.substring(0, this.fulljid.lastIndexOf("/"));
    a = new JSJaCIQ();
    a.setIQ(null, "set", "sess_1");
    a.appendNode("session", { xmlns: NS_SESSION }, []);
    this.oDbg.log(a.xml());
    this.send(a, this._doXMPPSessDone);
};
JSJaCConnection.prototype._doXMPPSessDone = function (a) {
    if (a.getType() != "result" || a.getType() == "error") {
        this.disconnect();
        if (a.getType() == "error") {
            this._handleEvent("onerror", a.getChild("error"));
        }
        return;
    } else {
        this._handleEvent("onconnect");
    }
};
JSJaCConnection.prototype._handleEvent = function (d, a) {
    d = d.toLowerCase();
    this.oDbg.log("incoming event '" + d + "'", 3);
    if (!this._events[d]) {
        return;
    }
    this.oDbg.log("handling event '" + d + "'", 2);
    for (var b = 0; b < this._events[d].length; b++) {
        var c = this._events[d][b];
        if (typeof c.handler == "function") {
            if (a) {
                if (a.pType) {
                    if ((!a.getNode().hasChildNodes() && c.childName != "*") || (a.getNode().hasChildNodes() && !a.getChild(c.childName, c.childNS))) {
                        continue;
                    }
                    if (c.type != "*" && a.getType() != c.type) {
                        continue;
                    }
                    this.oDbg.log(c.childName + "/" + c.childNS + "/" + c.type + " => match for handler " + c.handler, 3);
                }
                if (c.handler(a)) {
                    break;
                }
            } else {
                if (c.handler()) {
                    break;
                }
            }
        }
    }
};
JSJaCConnection.prototype._handlePID = function (c) {
    if (!c.getID()) {
        return false;
    }
    var a = c.getFrom() || this.jid;
    if (c.getFrom() == this.domain) {
        a = this.jid;
    }
    var d = c.getID();
    if (this._regIDs[a] && this._regIDs[a][d]) {
        this.oDbg.log("handling id " + d, 3);
        var b = this._regIDs[a][d];
        if (b.cb.call(this, c, b.arg) === false) {
            return false;
        } else {
            delete this._regIDs[a][d];
            return true;
        }
    } else {
        this.oDbg.log("not handling id '" + d + "' from jid " + a, 1);
        return false;
    }
};
JSJaCConnection.prototype._handleResponse = function (d) {
    var c = this._parseResponse(d);
    if (!c) {
        return;
    }
    for (var b = 0; b < c.childNodes.length; b++) {
        if (this._sendRawCallbacks.length) {
            var a = this._sendRawCallbacks[0];
            this._sendRawCallbacks = this._sendRawCallbacks.slice(1, this._sendRawCallbacks.length);
            a.fn.call(this, c.childNodes.item(b), a.arg);
            continue;
        }
        this._inQ = this._inQ.concat(c.childNodes.item(b));
    }
};
JSJaCConnection.prototype._parseStreamFeatures = function (f) {
    if (!f) {
        this.oDbg.log("nothing to parse ... aborting", 1);
        return false;
    }
    var e, b;
    if (f.getElementsByTagNameNS) {
        e = f.getElementsByTagNameNS(NS_STREAM, "error").item(0);
    } else {
        var g = f.getElementsByTagName("error");
        for (b = 0; b < g.length; b++) {
            if (g.item(b).namespaceURI == NS_STREAM || g.item(b).getAttribute("xmlns") == NS_STREAM) {
                e = g.item(b);
                break;
            }
        }
    }
    if (e) {
        this._setStatus("internal_server_error");
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        clearInterval(this._inQto);
        this._handleEvent("onerror", JSJaCError("503", "cancel", "session-terminate"));
        this._connected = false;
        this.oDbg.log("Disconnected.", 1);
        this._handleEvent("ondisconnect");
        return false;
    }
    this.mechs = {};
    var d = f.getElementsByTagName("mechanisms");
    if (!d.length) {
        return false;
    }
    this.has_sasl = false;
    for (b = 0; b < d.length; b++) {
        if (d.item(b).getAttribute("xmlns") == NS_SASL) {
            this.has_sasl = true;
            var c = d.item(b).getElementsByTagName("mechanism");
            for (var a = 0; a < c.length; a++) {
                this.mechs[c.item(a).firstChild.nodeValue] = true;
            }
            break;
        }
    }
    if (this.has_sasl) {
        this.oDbg.log("SASL detected", 2);
    } else {
        this.oDbg.log("No support for SASL detected", 2);
        return true;
    }
    return true;
};
JSJaCConnection.prototype._process = function (a) {
    if (!this.connected()) {
        this.oDbg.log("Connection lost ...", 1);
        if (this._interval) {
            clearInterval(this._interval);
        }
        return;
    }
    this.setPollInterval(a);
    if (this._timeout) {
        clearTimeout(this._timeout);
    }
    var d = this._getFreeSlot();
    if (d < 0) {
        return;
    }
    if (typeof (this._req[d]) != "undefined" && typeof (this._req[d].r) != "undefined" && this._req[d].r.readyState != 4) {
        this.oDbg.log("Slot " + d + " is not ready");
        return;
    }
    if (!this.isPolling() && this._pQueue.length === 0 && this._req[(d + 1) % 2] && this._req[(d + 1) % 2].r.readyState != 4) {
        this.oDbg.log("all slots busy, standby ...", 2);
        return;
    }
    if (!this.isPolling()) {
        this.oDbg.log("Found working slot at " + d, 2);
    }
    this._req[d] = this._setupRequest(true);
    this._req[d].r.onreadystatechange = JSJaC.bind(function () {
        if (!this.connected()) {
            return;
        }
        if (this._req[d].r.readyState == 4) {
            this.oDbg.log("async recv: " + this._req[d].r.responseText, 4);
            this._handleResponse(this._req[d]);
            this._setStatus("processing");
            if (this._pQueue.length) {
                this._timeout = setTimeout(JSJaC.bind(this._process, this), 100);
            } else {
                this.oDbg.log("scheduling next poll in " + this.getPollInterval() + " msec", 4);
                this._timeout = setTimeout(JSJaC.bind(this._process, this), this.getPollInterval());
            }
        }
    }, this);
    try {
        this._req[d].r.onerror = JSJaC.bind(function () {
            if (!this.connected()) {
                return;
            }
            this._errcnt++;
            this.oDbg.log("XmlHttpRequest error (" + this._errcnt + ")", 1);
            if (this._errcnt > JSJAC_ERR_COUNT) {
                this._abort();
                return;
            }
            this._setStatus("onerror_fallback");
            setTimeout(JSJaC.bind(this._repeat, this), JSJAC_RETRYDELAY);
            return;
        }, this);
    } catch (b) {
    }
    var c = this._getRequestString();
    if (typeof (this._rid) != "undefined") {
        this._req[d].rid = this._rid;
    }
    this.oDbg.log("sending: " + c, 4);
    this._req[d].r.send(c);
};
JSJaCConnection.prototype._registerPID = function (d, b, a) {
    this.oDbg.log("registering id for packet " + d.xml(), 3);
    var e = d.getID();
    if (!e) {
        this.oDbg.log("id missing", 1);
        return false;
    }
    if (typeof b != "function") {
        this.oDbg.log("callback is not a function", 1);
        return false;
    }
    var c = d.getTo() || this.jid;
    if (d.getTo() == this.domain) {
        c = this.jid;
    }
    if (!this._regIDs[c]) {
        this._regIDs[c] = {};
    }
    if (this._regIDs[c][e] != null) {
        this.oDbg.log("id already registered: " + e, 1);
        return false;
    }
    this._regIDs[c][e] = { cb: b, arg: a, ts: JSJaCUtils.now() };
    this.oDbg.log("registered id " + e, 3);
    this._cleanupRegisteredPIDs();
    return true;
};
JSJaCConnection.prototype._cleanupRegisteredPIDs = function () {
    var a = Date.now();
    for (var b in this._regIDs) {
        if (this._regIDs.hasOwnProperty(b)) {
            for (var c in this._regIDs[b]) {
                if (this._regIDs[b].hasOwnProperty(c)) {
                    if (this._regIDs[b][c].ts + JSJAC_REGID_TIMEOUT < a) {
                        this.oDbg.log("deleting registered id '" + c + "' due to timeout", 1);
                        delete this._regIDs[b][c];
                    }
                }
            }
        }
    }
};
JSJaCConnection.prototype._prepSendEmpty = function (a, b) {
    return function () {
        b._sendEmpty(JSJaC.bind(a, b));
    };
};
JSJaCConnection.prototype._sendEmpty = function (a) {
    var c = this._getFreeSlot();
    this._req[c] = this._setupRequest(true);
    this._req[c].r.onreadystatechange = JSJaC.bind(function () {
        if (this._req[c].r.readyState == 4) {
            this.oDbg.log("async recv: " + this._req[c].r.responseText, 4);
            a(this._req[c].r);
        }
    }, this);
    if (typeof (this._req[c].r.onerror) != "undefined") {
        this._req[c].r.onerror = JSJaC.bind(function () {
            this.oDbg.log("XmlHttpRequest error", 1);
        }, this);
    }
    var b = this._getRequestString();
    this.oDbg.log("sending: " + b, 4);
    this._req[c].r.send(b);
};
JSJaCConnection.prototype._sendRaw = function (c, b, a) {
    if (b) {
        this._sendRawCallbacks.push({ fn: b, arg: a });
    }
    this._pQueue.push(c);
    this._process();
    return true;
};
JSJaCConnection.prototype._setStatus = function (a) {
    if (!a || a === "") {
        return;
    }
    if (a != this._status) {
        this._status = a;
        this._handleEvent("onstatuschanged", a);
        this._handleEvent("status_changed", a);
    }
};

function JSJaCConsoleLogger(a) {
    this.level = a || 4;
    this.start = function () {
    };
    this.log = function (d, e) {
        e = e || 0;
        if (e > this.level) {
            return;
        }
        if (typeof (console) == "undefined") {
            return;
        }
        try {
            switch ( e ) {
                case 0:
                    console.warn(d);
                    break;
                case 1:
                    console.error(d);
                    break;
                case 2:
                    console.info(d);
                    break;
                case 4:
                    console.debug(d);
                    break;
                default:
                    console.log(d);
                    break;
            }
        } catch (c) {
            try {
                console.log(d);
            } catch (b) {
            }
        }
    };
    this.setLevel = function (b) {
        this.level = b;
        return this;
    };
    this.getLevel = function () {
        return this.level;
    };
}

function JSJaCCookieException(a) {
    this.message = a;
    this.name = "CookieException";
}

function JSJaCCookie(a, d, b, c, e) {
    if (window == this) {
        return new JSJaCCookie(a, d, b, c, e);
    }
    this.name = a;
    this.value = d;
    this.secs = b;
    this.domain = c;
    this.path = e;
    this.write = function () {
        var f;
        if (this.secs) {
            var g = new Date();
            g.setTime(g.getTime() + (this.secs * 1000));
            f = "; expires=" + g.toGMTString();
        } else {
            f = "";
        }
        var h = this.domain ? "; domain=" + this.domain : "";
        var i = this.path ? "; path=" + this.path : "; path=/";
        document.cookie = this.getName() + "=" + JSJaCCookie._escape(this.getValue()) + f + h + i;
    };
    this.erase = function () {
        var f = new JSJaCCookie(this.getName(), "", -1);
        f.write();
    };
    this.getName = function () {
        return this.name;
    };
    this.setName = function (f) {
        this.name = f;
        return this;
    };
    this.getValue = function () {
        return this.value;
    };
    this.setValue = function (f) {
        this.value = f;
        return this;
    };
    this.setDomain = function (f) {
        this.domain = f;
        return this;
    };
    this.setPath = function (f) {
        this.path = f;
        return this;
    };
}

JSJaCCookie.read = function (b) {
    var e = b + "=";
    var a = document.cookie.split(";");
    for (var d = 0; d < a.length; d++) {
        var f = a[d];
        while ( f.charAt(0) == " " ) {
            f = f.substring(1, f.length);
        }
        if (f.indexOf(e) === 0) {
            return new JSJaCCookie(b, JSJaCCookie._unescape(f.substring(e.length, f.length)));
        }
    }
    throw new JSJaCCookieException("Cookie not found");
};
JSJaCCookie.get = function (a) {
    return JSJaCCookie.read(a).getValue();
};
JSJaCCookie.remove = function (a) {
    JSJaCCookie.read(a).erase();
};
JSJaCCookie._escape = function (a) {
    return a.replace(/;/g, "%3AB");
};
JSJaCCookie._unescape = function (a) {
    return a.replace(/%3AB/g, ";");
};

function JSJaCDebugger() {
}

JSJaCDebugger.prototype.log = function (a, b) {
};

function JSJaCError(c, b, d) {
    var a = XmlDocument.create("error", "jsjac");
    a.documentElement.setAttribute("code", c);
    a.documentElement.setAttribute("type", b);
    if (d) {
        a.documentElement.appendChild(a.createElement(d)).setAttribute("xmlns", NS_STANZAS);
    }
    return a.documentElement;
}

function JSJaCHttpBindingConnection(a) {
    this.base = JSJaCConnection;
    this.base(a);
    this._hold = JSJACHBC_MAX_HOLD;
    this._inactivity = 0;
    this._last_requests = {};
    this._last_rid = 0;
    this._min_polling = 0;
    this._pause = 0;
    this._wait = a.wait || JSJACHBC_MAX_WAIT;
}

JSJaCHttpBindingConnection.prototype = new JSJaCConnection();
JSJaCHttpBindingConnection.prototype.inherit = function (a) {
    if (a.jid) {
        var b = new JSJaCJID(a.jid);
        this.domain = b.getDomain();
        this.username = b.getNode();
        this.resource = b.getResource();
    } else {
        this.domain = a.domain || "localhost";
        this.username = a.username;
        this.resource = a.resource;
    }
    this._sid = a.sid;
    this._rid = a.rid;
    this._min_polling = a.polling;
    this._inactivity = a.inactivity;
    this._setHold(a.requests - 1);
    this.setPollInterval(this._timerval);
    if (a.wait) {
        this._wait = a.wait;
    }
    this._connected = true;
    this._handleEvent("onconnect");
    this._interval = setInterval(JSJaC.bind(this._checkQueue, this), JSJAC_CHECKQUEUEINTERVAL);
    this._inQto = setInterval(JSJaC.bind(this._checkInQ, this), JSJAC_CHECKINQUEUEINTERVAL);
    this._timeout = setTimeout(JSJaC.bind(this._process, this), this.getPollInterval());
};
JSJaCHttpBindingConnection.prototype.setPollInterval = function (a) {
    if (a && !isNaN(a)) {
        if (!this.isPolling()) {
            this._timerval = 100;
        } else {
            if (this._min_polling && a < this._min_polling * 1000) {
                this._timerval = this._min_polling * 1000;
            } else {
                if (this._inactivity && a > this._inactivity * 1000) {
                    this._timerval = this._inactivity * 1000;
                } else {
                    this._timerval = a;
                }
            }
        }
    }
    return this._timerval;
};
JSJaCHttpBindingConnection.prototype.isPolling = function () {
    return (this._hold === 0);
};
JSJaCHttpBindingConnection.prototype._getFreeSlot = function () {
    for (var a = 0; a < this._hold + 1; a++) {
        if (typeof (this._req[a]) == "undefined" || typeof (this._req[a].r) == "undefined" || this._req[a].r.readyState == 4) {
            return a;
        }
    }
    return -1;
};
JSJaCHttpBindingConnection.prototype._getHold = function () {
    return this._hold;
};
JSJaCHttpBindingConnection.prototype._getRequestString = function (b, e) {
    b = b || "";
    var f = "";
    if (this._rid <= this._last_rid && typeof (this._last_requests[this._rid]) != "undefined") {
        f = this._last_requests[this._rid].xml;
    } else {
        var a = "";
        while ( this._pQueue.length ) {
            var d = this._pQueue[0];
            a += d;
            this._pQueue = this._pQueue.slice(1, this._pQueue.length);
        }
        f = "<body rid='" + this._rid + "' sid='" + this._sid + "' xmlns='http://jabber.org/protocol/httpbind'";
        if (JSJAC_HAVEKEYS) {
            f += " key='" + this._keys.getKey() + "'";
            if (this._keys.lastKey()) {
                this._keys = new JSJaCKeys(hex_sha1, this.oDbg);
                f += " newkey='" + this._keys.getKey() + "'";
            }
        }
        if (e) {
            f += " type='terminate'";
        } else {
            if (this._reinit) {
                if (JSJACHBC_USE_BOSH_VER) {
                    f += " xml:lang='" + this._xmllang + "' xmpp:restart='true' xmlns:xmpp='urn:xmpp:xbosh' to='" + this.domain + "'";
                }
                this._reinit = false;
            }
        }
        if (a !== "" || b !== "") {
            f += ">" + b + a + "</body>";
        } else {
            f += "/>";
        }
        this._last_requests[this._rid] = {};
        this._last_requests[this._rid].xml = f;
        this._last_rid = this._rid;
        for (var c in this._last_requests) {
            if (this._last_requests.hasOwnProperty(c) && c < this._rid - this._hold) {
                delete (this._last_requests[c]);
            }
        }
    }
    return f;
};
JSJaCHttpBindingConnection.prototype._getInitialRequestString = function () {
    var b = "<body content='text/xml; charset=utf-8' hold='" + this._hold + "' xmlns='http://jabber.org/protocol/httpbind' to='" + this.authhost + "' wait='" + this._wait + "' rid='" + this._rid + "'";
    if (this.host && this.port) {
        b += " route='xmpp:" + this.host + ":" + this.port + "'";
    }
    if (JSJAC_HAVEKEYS) {
        this._keys = new JSJaCKeys(hex_sha1, this.oDbg);
        var a = this._keys.getKey();
        b += " newkey='" + a + "'";
    }
    b += " xml:lang='" + this._xmllang + "'";
    if (JSJACHBC_USE_BOSH_VER) {
        b += " ver='" + JSJACHBC_BOSH_VERSION + "'";
        b += " xmlns:xmpp='urn:xmpp:xbosh'";
        if (this.authtype == "sasl" || this.authtype == "saslanon") {
            b += " xmpp:version='1.0'";
        }
    }
    b += "/>";
    return b;
};
JSJaCHttpBindingConnection.prototype._getStreamID = function (b) {
    this.oDbg.log(b.responseText, 4);
    if (!b.responseXML || !b.responseXML.documentElement) {
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    var a = b.responseXML.documentElement;
    if (a.getAttribute("type") == "terminate") {
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    if (a.getAttribute("authid")) {
        this.streamid = a.getAttribute("authid");
        this.oDbg.log("got streamid: " + this.streamid, 2);
    }
    if (!this._parseStreamFeatures(a)) {
        this._sendEmpty(JSJaC.bind(this._getStreamID, this));
        return;
    }
    this._timeout = setTimeout(JSJaC.bind(this._process, this), this.getPollInterval());
    if (this.register) {
        this._doInBandReg();
    } else {
        this._doAuth();
    }
};
JSJaCHttpBindingConnection.prototype._getSuspendVars = function () {
    return ("host,port,_rid,_last_rid,_wait,_min_polling,_inactivity,_hold,_last_requests,_pause").split(",");
};
JSJaCHttpBindingConnection.prototype._handleInitialResponse = function (c) {
    try {
        this.oDbg.log(c.getAllResponseHeaders(), 4);
        this.oDbg.log(c.responseText, 4);
    } catch (b) {
        this.oDbg.log("No response", 4);
    }
    if (c.status != 200 || !c.responseXML) {
        this.oDbg.log("initial response broken (status: " + c.status + ")", 1);
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    var a = c.responseXML.documentElement;
    if (!a || a.tagName != "body" || a.namespaceURI != NS_BOSH) {
        this.oDbg.log("no body element or incorrect body in initial response", 1);
        this._handleEvent("onerror", JSJaCError("500", "wait", "internal-service-error"));
        return;
    }
    if (a.getAttribute("type") == "terminate") {
        this.oDbg.log("invalid response:\n" + c.responseText, 1);
        clearTimeout(this._timeout);
        this._connected = false;
        this.oDbg.log("Disconnected.", 1);
        this._handleEvent("ondisconnect");
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    this._sid = a.getAttribute("sid");
    this.oDbg.log("got sid: " + this._sid, 2);
    if (a.getAttribute("polling")) {
        this._min_polling = a.getAttribute("polling");
    }
    if (a.getAttribute("inactivity")) {
        this._inactivity = a.getAttribute("inactivity");
    }
    if (a.getAttribute("requests")) {
        this._setHold(a.getAttribute("requests") - 1);
    }
    this.oDbg.log("set hold to " + this._getHold(), 2);
    if (a.getAttribute("ver")) {
        this._bosh_version = a.getAttribute("ver");
    }
    if (a.getAttribute("maxpause")) {
        this._pause = Number.min(a.getAttribute("maxpause"), JSJACHBC_MAXPAUSE);
    }
    this.setPollInterval(this._timerval);
    this._connected = true;
    this._inQto = setInterval(JSJaC.bind(this._checkInQ, this), JSJAC_CHECKINQUEUEINTERVAL);
    this._interval = setInterval(JSJaC.bind(this._checkQueue, this), JSJAC_CHECKQUEUEINTERVAL);
    this._getStreamID(c);
};
JSJaCHttpBindingConnection.prototype._parseResponse = function (d) {
    if (!this.connected() || !d) {
        return null;
    }
    var c = d.r;
    try {
        if (c.status == 404 || c.status == 403) {
            this._abort();
            return null;
        }
        if (c.status != 200 || !c.responseXML) {
            this._errcnt++;
            var h = "invalid response (" + c.status + "):\n" + c.getAllResponseHeaders() + "\n" + c.responseText;
            if (!c.responseXML) {
                h += "\nResponse failed to parse!";
            }
            this.oDbg.log(h, 1);
            if (this._errcnt > JSJAC_ERR_COUNT) {
                this._abort();
                return null;
            }
            if (this.connected()) {
                this.oDbg.log("repeating (" + this._errcnt + ")", 1);
                this._setStatus("proto_error_fallback");
                setTimeout(JSJaC.bind(this._repeat, this), this.getPollInterval());
            }
            return null;
        }
    } catch (f) {
        this.oDbg.log("XMLHttpRequest error: status not available", 1);
        this._errcnt++;
        if (this._errcnt > JSJAC_ERR_COUNT) {
            this._abort();
        } else {
            if (this.connected()) {
                this.oDbg.log("repeating (" + this._errcnt + ")", 1);
                this._setStatus("proto_error_fallback");
                setTimeout(JSJaC.bind(this._repeat, this), this.getPollInterval());
            }
        }
        return null;
    }
    var a = c.responseXML.documentElement;
    if (!a || a.tagName != "body" || a.namespaceURI != NS_BOSH) {
        this.oDbg.log("invalid response:\n" + c.responseText, 1);
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        clearInterval(this._inQto);
        this._connected = false;
        this.oDbg.log("Disconnected.", 1);
        this._handleEvent("ondisconnect");
        this._setStatus("internal_server_error");
        this._handleEvent("onerror", JSJaCError("500", "wait", "internal-server-error"));
        return null;
    }
    if (typeof (d.rid) != "undefined" && this._last_requests[d.rid]) {
        if (this._last_requests[d.rid].handled) {
            this.oDbg.log("already handled " + d.rid, 2);
            return null;
        } else {
            this._last_requests[d.rid].handled = true;
        }
    }
    if (a.getAttribute("type") == "terminate") {
        var g = a.getAttribute("condition");
        this.oDbg.log("session terminated:\n" + c.responseText, 1);
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        clearInterval(this._inQto);
        try {
            JSJaCCookie.read(this._cookie_prefix + "JSJaC_State").erase();
        } catch (f) {
        }
        this._connected = false;
        if (g == "remote-stream-error") {
            if (a.getElementsByTagName("conflict").length > 0) {
                this._setStatus("session-terminate-conflict");
            } else {
                this._setStatus("terminated");
            }
        } else {
            this._setStatus("terminated");
        }
        if (g === null) {
            g = "session-terminate";
        }
        this._handleEvent("onerror", JSJaCError("503", "cancel", g));
        this.oDbg.log("Aborting remaining connections", 4);
        for (var b = 0; b < this._hold + 1; b++) {
            try {
                if (this._req[b] && this._req[b] != d) {
                    this._req[b].r.abort();
                }
            } catch (f) {
                this.oDbg.log(f, 1);
            }
        }
        this.oDbg.log("parseResponse done with terminating", 3);
        this.oDbg.log("Disconnected.", 1);
        this._handleEvent("ondisconnect");
        return null;
    }
    this._errcnt = 0;
    return c.responseXML.documentElement;
};
JSJaCHttpBindingConnection.prototype._reInitStream = function (a) {
    this._reinit = true;
    this._sendEmpty(this._prepReInitStreamWait(a));
};
JSJaCHttpBindingConnection.prototype._prepReInitStreamWait = function (a) {
    return JSJaC.bind(function (b) {
        this._reInitStreamWait(b, a);
    }, this);
};
JSJaCHttpBindingConnection.prototype._reInitStreamWait = function (f, a) {
    this.oDbg.log("checking for stream features");
    var g = f.responseXML.documentElement, e, h;
    this.oDbg.log(g);
    if (g.getElementsByTagNameNS) {
        this.oDbg.log("checking with namespace");
        e = g.getElementsByTagNameNS(NS_STREAM, "features").item(0);
        if (e) {
            h = e.getElementsByTagNameNS(NS_BIND, "bind").item(0);
        }
    } else {
        var c = g.getElementsByTagName("stream:features"), d, b;
        for (d = 0, b = c.length; d < b; d++) {
            if (c.item(d).namespaceURI == NS_STREAM || c.item(d).getAttribute("xmlns") == NS_STREAM) {
                e = c.item(d);
                break;
            }
        }
        if (e) {
            h = e.getElementsByTagName("bind");
            for (d = 0, b = h.length; d < b; d++) {
                if (h.item(d).namespaceURI == NS_BIND || h.item(d).getAttribute("xmlns") == NS_BIND) {
                    h = h.item(d);
                    break;
                }
            }
        }
    }
    this.oDbg.log(e);
    this.oDbg.log(h);
    if (e) {
        if (h) {
            a();
        } else {
            this.oDbg.log("no bind feature - giving up", 1);
            this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
            this._connected = false;
            this.oDbg.log("Disconnected.", 1);
            this._handleEvent("ondisconnect");
        }
    } else {
        this._sendEmpty(this._prepReInitStreamWait(a));
    }
};
JSJaCHttpBindingConnection.prototype._repeat = function () {
    if (this._rid >= this._last_rid) {
        this._rid = this._last_rid - 1;
    }
    this._process();
};
JSJaCHttpBindingConnection.prototype._resume = function () {
    if (this._pause === 0) {
        this._repeat();
    } else {
        this._process();
    }
};
JSJaCHttpBindingConnection.prototype._setHold = function (a) {
    if (!a || isNaN(a) || a < 0) {
        a = 0;
    } else {
        if (a > JSJACHBC_MAX_HOLD) {
            a = JSJACHBC_MAX_HOLD;
        }
    }
    this._hold = a;
    return this._hold;
};
JSJaCHttpBindingConnection.prototype._setupRequest = function (a) {
    var c = {};
    var b = XmlHttp.create();
    try {
        b.open("POST", this._httpbase, a);
        b.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
    } catch (d) {
        this.oDbg.log(d, 1);
    }
    c.r = b;
    this._rid++;
    c.rid = this._rid;
    return c;
};
JSJaCHttpBindingConnection.prototype._suspend = function () {
    if (this._pause === 0) {
        return;
    }
    var c = this._getFreeSlot();
    this._req[c] = this._setupRequest(false);
    var b = "<body pause='" + this._pause + "' xmlns='http://jabber.org/protocol/httpbind' sid='" + this._sid + "' rid='" + this._rid + "'";
    if (JSJAC_HAVEKEYS) {
        b += " key='" + this._keys.getKey() + "'";
        if (this._keys.lastKey()) {
            this._keys = new JSJaCKeys(hex_sha1, this.oDbg);
            b += " newkey='" + this._keys.getKey() + "'";
        }
    }
    b += ">";
    while ( this._pQueue.length ) {
        var a = this._pQueue[0];
        b += a;
        this._pQueue = this._pQueue.slice(1, this._pQueue.length);
    }
    b += "</body>";
    this.oDbg.log("Disconnecting: " + b, 4);
    this._req[c].r.send(b);
};

function JSJaCHttpPollingConnection(a) {
    this.base = JSJaCConnection;
    this.base(a);
    JSJACPACKET_USE_XMLNS = false;
}

JSJaCHttpPollingConnection.prototype = new JSJaCConnection();
JSJaCHttpPollingConnection.prototype.isPolling = function () {
    return true;
};
JSJaCHttpPollingConnection.prototype._getFreeSlot = function () {
    if (typeof (this._req[0]) == "undefined" || typeof (this._req[0].r) == "undefined" || this._req[0].r.readyState == 4) {
        return 0;
    } else {
        return -1;
    }
};
JSJaCHttpPollingConnection.prototype._getInitialRequestString = function () {
    var c = "0";
    if (JSJAC_HAVEKEYS) {
        this._keys = new JSJaCKeys(b64_sha1, this.oDbg);
        var a = this._keys.getKey();
        c += ";" + a;
    }
    var b = this.domain;
    if (this.authhost) {
        b = this.authhost;
    }
    c += ",<stream:stream to='" + b + "' xmlns='jabber:client' xmlns:stream='http://etherx.jabber.org/streams'";
    if (this.authtype == "sasl" || this.authtype == "saslanon") {
        c += " version='1.0'";
    }
    c += ">";
    return c;
};
JSJaCHttpPollingConnection.prototype._getRequestString = function (a, b) {
    var c = this._sid;
    if (JSJAC_HAVEKEYS) {
        c += ";" + this._keys.getKey();
        if (this._keys.lastKey()) {
            this._keys = new JSJaCKeys(b64_sha1, this.oDbg);
            c += ";" + this._keys.getKey();
        }
    }
    c += ",";
    if (a) {
        c += a;
    }
    while ( this._pQueue.length ) {
        c += this._pQueue[0];
        this._pQueue = this._pQueue.slice(1, this._pQueue.length);
    }
    if (b) {
        c += "</stream:stream>";
    }
    return c;
};
JSJaCHttpPollingConnection.prototype._getStreamID = function () {
    if (this._req[0].r.responseText === "") {
        this.oDbg.log("waiting for stream id", 2);
        this._timeout = setTimeout(JSJaC.bind(this._sendEmpty, this), 1000);
        return;
    }
    this.oDbg.log(this._req[0].r.responseText, 4);
    if (this._req[0].r.responseText.match(/id=[\'\"]([^\'\"]+)[\'\"]/)) {
        this.streamid = RegExp.$1;
    }
    this.oDbg.log("got streamid: " + this.streamid, 2);
    var c;
    try {
        var a = this._req[0].r.responseText;
        if (!a.match(/<\/stream:stream>\s*$/)) {
            a += "</stream:stream>";
        }
        c = XmlDocument.create("doc");
        c.loadXML(a);
        if (!this._parseStreamFeatures(c)) {
            this.authtype = "nonsasl";
            return;
        }
    } catch (b) {
        this.oDbg.log("loadXML: " + b.toString(), 1);
    }
    this._connected = true;
    if (this.register) {
        this._doInBandReg();
    } else {
        this._doAuth();
    }
    this._process(this._timerval);
};
JSJaCHttpPollingConnection.prototype._getSuspendVars = function () {
    return [];
};
JSJaCHttpPollingConnection.prototype._handleInitialResponse = function () {
    this.oDbg.log(this._req[0].r.getAllResponseHeaders(), 4);
    var c = this._req[0].r.getResponseHeader("Set-Cookie");
    c = c.split(";");
    for (var b = 0; b < c.length; b++) {
        var a = c[b].split("=");
        if (a[0] == "ID") {
            this._sid = a[1];
        }
    }
    this.oDbg.log("got sid: " + this._sid, 2);
    this._connected = true;
    this._interval = setInterval(JSJaC.bind(this._checkQueue, this), JSJAC_CHECKQUEUEINTERVAL);
    this._inQto = setInterval(JSJaC.bind(this._checkInQ, this), JSJAC_CHECKINQUEUEINTERVAL);
    this._getStreamID();
};
JSJaCHttpPollingConnection.prototype._parseResponse = function (a) {
    var h = a.r;
    if (!this.connected()) {
        return null;
    }
    if (h.status != 200) {
        this.oDbg.log("invalid response (" + h.status + "):" + h.responseText + "\n" + h.getAllResponseHeaders(), 1);
        this._setStatus("internal_server_error");
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        clearInterval(this._inQto);
        this._connected = false;
        this.oDbg.log("Disconnected.", 1);
        this._handleEvent("ondisconnect");
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return null;
    }
    this.oDbg.log(h.getAllResponseHeaders(), 4);
    var b, j = h.getResponseHeader("Set-Cookie");
    if (j === null) {
        b = "-1:0";
    } else {
        j = j.split(";");
        for (var d = 0; d < j.length; d++) {
            var g = j[d].split("=");
            if (g[0] == "ID") {
                b = g[1];
            }
        }
    }
    if (typeof (b) != "undefined" && b.indexOf(":0") != -1) {
        switch ( b.substring(0, b.indexOf(":0")) ) {
            case"0":
                this.oDbg.log("invalid response:" + h.responseText, 1);
                break;
            case"-1":
                this.oDbg.log("Internal Server Error", 1);
                break;
            case"-2":
                this.oDbg.log("Bad Request", 1);
                break;
            case"-3":
                this.oDbg.log("Key Sequence Error", 1);
                break;
        }
        this._setStatus("internal_server_error");
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        clearInterval(this._inQto);
        this._handleEvent("onerror", JSJaCError("500", "wait", "internal-server-error"));
        this._connected = false;
        this.oDbg.log("Disconnected.", 1);
        this._handleEvent("ondisconnect");
        return null;
    }
    if (!h.responseText) {
        return null;
    }
    try {
        var c = h.responseText.replace(/<\?xml.+\?>/, "");
        if (c.match(/<stream:stream/)) {
            c += "</stream:stream>";
        }
        var k = JSJaCHttpPollingConnection._parseTree("<body>" + c + "</body>");
        if (!k || k.tagName == "parsererror") {
            this.oDbg.log("parsererror", 1);
            k = JSJaCHttpPollingConnection._parseTree("<stream:stream xmlns:stream='http://etherx.jabber.org/streams'>" + h.responseText);
            if (k && k.tagName != "parsererror") {
                this.oDbg.log("stream closed", 1);
                if (k.getElementsByTagName("conflict").length > 0) {
                    this._setStatus("session-terminate-conflict");
                }
                clearTimeout(this._timeout);
                clearInterval(this._interval);
                clearInterval(this._inQto);
                this._handleEvent("onerror", JSJaCError("503", "cancel", "session-terminate"));
                this._connected = false;
                this.oDbg.log("Disconnected.", 1);
                this._handleEvent("ondisconnect");
            } else {
                this.oDbg.log("parsererror:" + k, 1);
            }
            return k;
        }
        return k;
    } catch (f) {
        this.oDbg.log("parse error:" + f.message, 1);
    }
    return null;
};
JSJaCHttpPollingConnection.prototype._reInitStream = function (a) {
    var b = this.authhost ? this.authhost : this.domain;
    this._sendRaw("<stream:stream xmlns:stream='http://etherx.jabber.org/streams' xmlns='jabber:client' to='" + b + "' version='1.0'>", a);
};
JSJaCHttpPollingConnection.prototype._repeat = function () {
    this._resume();
};
JSJaCHttpPollingConnection.prototype._resume = function () {
    this._process(this._timerval);
};
JSJaCHttpPollingConnection.prototype._setupRequest = function (a) {
    var c = XmlHttp.create();
    try {
        c.open("POST", this._httpbase, a);
        if (c.overrideMimeType) {
            c.overrideMimeType("text/plain; charset=utf-8");
        }
        c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } catch (d) {
        this.oDbg.log(d, 1);
    }
    var b = {};
    b.r = c;
    return b;
};
JSJaCHttpPollingConnection.prototype._suspend = function () {
};
JSJaCHttpPollingConnection._parseTree = function (a) {
    try {
        var b = XmlDocument.create("body", "foo");
        if (typeof (b.loadXML) != "undefined") {
            b.loadXML(a);
            return b.documentElement;
        } else {
            if (window.DOMParser) {
                return (new DOMParser()).parseFromString(a, "text/xml").documentElement;
            }
        }
    } catch (c) {
    }
    return null;
};

function JSJaCJIDInvalidException(a) {
    this.message = a;
    this.name = "JSJaCJIDInvalidException";
}

var JSJACJID_FORBIDDEN = ['"', " ", "&", "'", "/", ":", "<", ">", "@"];

function JSJaCJID(a) {
    this._node = "";
    this._domain = "";
    this._resource = "";
    if (typeof (a) == "string") {
        if (a.indexOf("@") != -1) {
            this.setNode(a.substring(0, a.indexOf("@")));
            a = a.substring(a.indexOf("@") + 1);
        }
        if (a.indexOf("/") != -1) {
            this.setResource(a.substring(a.indexOf("/") + 1));
            a = a.substring(0, a.indexOf("/"));
        }
        this.setDomain(a);
    } else {
        this.setNode(a.node);
        this.setDomain(a.domain);
        this.setResource(a.resource);
    }
}

JSJaCJID.prototype.getBareJID = function () {
    return this.getNode() + "@" + this.getDomain();
};
JSJaCJID.prototype.getNode = function () {
    return this._node;
};
JSJaCJID.prototype.getDomain = function () {
    return this._domain;
};
JSJaCJID.prototype.getResource = function () {
    return this._resource;
};
JSJaCJID.prototype.setNode = function (a) {
    JSJaCJID._checkNodeName(a);
    this._node = a || "";
    return this;
};
JSJaCJID.prototype.setDomain = function (a) {
    if (!a || a === "") {
        throw new JSJaCJIDInvalidException("domain name missing");
    }
    JSJaCJID._checkNodeName(a);
    this._domain = a;
    return this;
};
JSJaCJID.prototype.setResource = function (a) {
    this._resource = a || "";
    return this;
};
JSJaCJID.prototype.toString = function () {
    var a = "";
    if (this.getNode() && this.getNode() !== "") {
        a = this.getNode() + "@";
    }
    a += this.getDomain();
    if (this.getResource() && this.getResource() !== "") {
        a += "/" + this.getResource();
    }
    return a;
};
JSJaCJID.prototype.removeResource = function () {
    return this.setResource();
};
JSJaCJID.prototype.clone = function () {
    return new JSJaCJID(this.toString());
};
JSJaCJID.prototype.isEntity = function (a) {
    if (typeof a == "string") {
        a = (new JSJaCJID(a));
    } else {
        a = a.clone();
    }
    a.removeResource();
    return (this.clone().removeResource().toString() === a.toString());
};
JSJaCJID._checkNodeName = function (a) {
    if (!a || a === "") {
        return;
    }
    for (var b = 0; b < JSJACJID_FORBIDDEN.length; b++) {
        if (a.indexOf(JSJACJID_FORBIDDEN[b]) != -1) {
            throw new JSJaCJIDInvalidException("forbidden char in nodename: " + JSJACJID_FORBIDDEN[b]);
        }
    }
};

function JSJaCJSON() {
}

JSJaCJSON.toString = function (c) {
    var a = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, b = {
        array: function (g) {
            var j = ["["], d, n, m, h = g.length, k;
            for (m = 0; m < h; m += 1) {
                k = g[m];
                n = b[typeof k];
                if (n) {
                    try {
                        k = n(k);
                        if (typeof k == "string") {
                            if (d) {
                                j[j.length] = ",";
                            }
                            j[j.length] = k;
                            d = true;
                        }
                    } catch (o) {
                    }
                }
            }
            j[j.length] = "]";
            return j.join("");
        }, "boolean": function (d) {
            return String(d);
        }, "null": function () {
            return "null";
        }, number: function (d) {
            return isFinite(d) ? String(d) : "null";
        }, object: function (g) {
            if (g) {
                if (g instanceof Array) {
                    return b.array(g);
                }
                var h = [], d, l, k, j;
                h.push("{");
                for (k in g) {
                    if (g.hasOwnProperty(k)) {
                        j = g[k];
                        l = b[typeof j];
                        if (l) {
                            try {
                                j = l(j);
                                if (typeof j == "string") {
                                    if (d) {
                                        h[h.length] = ",";
                                    }
                                    h.push(b.string(k), ":", j);
                                    d = true;
                                }
                            } catch (m) {
                            }
                        }
                    }
                }
                h[h.length] = "}";
                return h.join("");
            }
            return "null";
        }, string: function (d) {
            if (/["\\\x00-\x1f]/.test(d)) {
                d = d.replace(/([\x00-\x1f\\"])/g, function (f, e) {
                    var g = a[e];
                    if (g) {
                        return g;
                    }
                    g = e.charCodeAt();
                    return "\\u00" + Math.floor(g / 16).toString(16) + (g % 16).toString(16);
                });
            }
            return '"' + d + '"';
        }
    };
    switch ( typeof (c) ) {
        case"object":
            return b.object(c);
        case"array":
            return b.array(c);
    }
};
JSJaCJSON.parse = function (str) {
    try {
        return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(str.replace(/"(\\.|[^"\\])*"/g, ""))) && eval("(" + str + ")");
    } catch (e) {
        return false;
    }
};

function JSJaCKeys(d, c) {
    var a = Math.random();
    this._k = [];
    this._k[0] = a.toString();
    if (c) {
        this.oDbg = c;
    } else {
        this.oDbg = {};
        this.oDbg.log = function () {
        };
    }
    if (d) {
        for (var b = 1; b < JSJAC_NKEYS; b++) {
            this._k[b] = d(this._k[b - 1]);
            c.log(b + ": " + this._k[b], 4);
        }
    }
    this._indexAt = JSJAC_NKEYS - 1;
    this.getKey = function () {
        return this._k[this._indexAt--];
    };
    this.lastKey = function () {
        return (this._indexAt === 0);
    };
    this.size = function () {
        return this._k.length;
    };
    this._getSuspendVars = function () {
        return ("_k,_indexAt").split(",");
    };
}

var JSJACPACKET_USE_XMLNS = true;

function JSJaCPacket(a) {
    this.name = a;
    if (typeof (JSJACPACKET_USE_XMLNS) != "undefined" && JSJACPACKET_USE_XMLNS) {
        this.doc = XmlDocument.create(a, NS_CLIENT);
    } else {
        this.doc = XmlDocument.create(a, "");
    }
}

JSJaCPacket.prototype.pType = function () {
    return this.name;
};
JSJaCPacket.prototype.getDoc = function () {
    return this.doc;
};
JSJaCPacket.prototype.getNode = function () {
    if (this.getDoc() && this.getDoc().documentElement) {
        return this.getDoc().documentElement;
    } else {
        return null;
    }
};
JSJaCPacket.prototype.setTo = function (a) {
    if (!a) {
        this.getNode().removeAttribute("to");
    } else {
        if (typeof (a) == "string") {
            this.getNode().setAttribute("to", a);
        } else {
            this.getNode().setAttribute("to", a.toString());
        }
    }
    return this;
};
JSJaCPacket.prototype.setFrom = function (a) {
    if (!a) {
        this.getNode().removeAttribute("from");
    } else {
        if (typeof (a) == "string") {
            this.getNode().setAttribute("from", a);
        } else {
            this.getNode().setAttribute("from", a.toString());
        }
    }
    return this;
};
JSJaCPacket.prototype.setID = function (a) {
    if (!a) {
        this.getNode().removeAttribute("id");
    } else {
        this.getNode().setAttribute("id", a);
    }
    return this;
};
JSJaCPacket.prototype.setType = function (a) {
    if (!a) {
        this.getNode().removeAttribute("type");
    } else {
        this.getNode().setAttribute("type", a);
    }
    return this;
};
JSJaCPacket.prototype.setXMLLang = function (a) {
    if (!a) {
        this.getNode().removeAttribute("xml:lang");
    } else {
        this.getNode().setAttribute("xml:lang", a);
    }
    return this;
};
JSJaCPacket.prototype.getTo = function () {
    return this.getNode().getAttribute("to");
};
JSJaCPacket.prototype.getFrom = function () {
    return this.getNode().getAttribute("from");
};
JSJaCPacket.prototype.getToJID = function () {
    return new JSJaCJID(this.getTo());
};
JSJaCPacket.prototype.getFromJID = function () {
    return new JSJaCJID(this.getFrom());
};
JSJaCPacket.prototype.getID = function () {
    return this.getNode().getAttribute("id");
};
JSJaCPacket.prototype.getType = function () {
    return this.getNode().getAttribute("type");
};
JSJaCPacket.prototype.getXMLLang = function () {
    return this.getNode().getAttribute("xml:lang");
};
JSJaCPacket.prototype.getXMLNS = function () {
    return this.getNode().namespaceURI || this.getNode().getAttribute("xmlns");
};
JSJaCPacket.prototype.getChild = function (b, d) {
    if (!this.getNode()) {
        return null;
    }
    b = b || "*";
    d = d || "*";
    if (this.getNode().getElementsByTagNameNS) {
        return this.getNode().getElementsByTagNameNS(d, b).item(0);
    }
    var a = this.getNode().getElementsByTagName(b);
    if (d != "*") {
        for (var c = 0; c < a.length; c++) {
            if (a.item(c).namespaceURI == d || a.item(c).getAttribute("xmlns") == d) {
                return a.item(c);
            }
        }
    } else {
        return a.item(0);
    }
    return null;
};
JSJaCPacket.prototype.getChildVal = function (b, d) {
    var e = this.getChild(b, d);
    var a = "";
    if (e && e.hasChildNodes()) {
        for (var c = 0; c < e.childNodes.length; c++) {
            if (e.childNodes.item(c).nodeValue) {
                a += e.childNodes.item(c).nodeValue;
            }
        }
    }
    return a;
};
JSJaCPacket.prototype.clone = function () {
    return JSJaCPacket.wrapNode(this.getNode());
};
JSJaCPacket.prototype.isError = function () {
    return (this.getType() == "error");
};
JSJaCPacket.prototype.errorReply = function (a) {
    var b = this.clone();
    b.setTo(this.getFrom());
    b.setFrom();
    b.setType("error");
    b.appendNode("error", { code: a.code, type: a.type }, [[a.cond, { xmlns: NS_STANZAS }]]);
    return b;
};
JSJaCPacket.prototype.xml = typeof XMLSerializer != "undefined" ? function () {
    var a = (new XMLSerializer()).serializeToString(this.getNode());
    if (typeof (a) == "undefined") {
        a = (new XMLSerializer()).serializeToString(this.doc);
    }
    return a;
} : function () {
    return this.getDoc().xml;
};
JSJaCPacket.prototype._getAttribute = function (a) {
    return this.getNode().getAttribute(a);
};
if (!document.ELEMENT_NODE) {
    document.ELEMENT_NODE = 1;
    document.ATTRIBUTE_NODE = 2;
    document.TEXT_NODE = 3;
    document.CDATA_SECTION_NODE = 4;
    document.ENTITY_REFERENCE_NODE = 5;
    document.ENTITY_NODE = 6;
    document.PROCESSING_INSTRUCTION_NODE = 7;
    document.COMMENT_NODE = 8;
    document.DOCUMENT_NODE = 9;
    document.DOCUMENT_TYPE_NODE = 10;
    document.DOCUMENT_FRAGMENT_NODE = 11;
    document.NOTATION_NODE = 12;
}
JSJaCPacket.prototype._importNode = function (f, b) {
    switch ( f.nodeType ) {
        case document.ELEMENT_NODE:
            var e;
            if (this.getDoc().createElementNS) {
                e = this.getDoc().createElementNS(f.namespaceURI, f.nodeName);
            } else {
                e = this.getDoc().createElement(f.nodeName);
            }
            var d, c;
            if (f.attributes && f.attributes.length > 0) {
                for (d = 0, c = f.attributes.length; d < c; d++) {
                    var a = f.attributes.item(d);
                    if (a.nodeName == "xmlns" && (e.getAttribute("xmlns") !== null || e.namespaceURI)) {
                        continue;
                    }
                    if (e.setAttributeNS && a.namespaceURI) {
                        e.setAttributeNS(a.namespaceURI, a.name, a.value);
                    } else {
                        e.setAttribute(a.name, a.value);
                    }
                }
            }
            if (b && f.childNodes && f.childNodes.length > 0) {
                for (d = 0, c = f.childNodes.length; d < c; d++) {
                    e.appendChild(this._importNode(f.childNodes.item(d), b));
                }
            }
            return e;
        case document.TEXT_NODE:
        case document.CDATA_SECTION_NODE:
        case document.COMMENT_NODE:
            return this.getDoc().createTextNode(f.nodeValue);
    }
};
JSJaCPacket.prototype._setChildNode = function (g, b) {
    var a = this.getChild(g);
    var d = this.getDoc().createTextNode(b);
    if (a) {
        try {
            a.replaceChild(d, a.firstChild);
        } catch (f) {
        }
    } else {
        try {
            a = this.getDoc().createElementNS(this.getNode().namespaceURI, g);
        } catch (c) {
            a = this.getDoc().createElement(g);
        }
        this.getNode().appendChild(a);
        a.appendChild(d);
    }
    return a;
};
JSJaCPacket.prototype.buildNode = function (a) {
    return JSJaCBuilder.buildNode(this.getDoc(), a, arguments[1], arguments[2], arguments[3]);
};
JSJaCPacket.prototype.appendNode = function (a) {
    if (typeof a == "object") {
        this.getNode().appendChild(a);
    } else {
        this.getNode().appendChild(this.buildNode(a, arguments[1], arguments[2], this.getNode().namespaceURI));
    }
    return this;
};

function JSJaCPresence() {
    this.base = JSJaCPacket;
    this.base("presence");
}

JSJaCPresence.prototype = new JSJaCPacket();
JSJaCPresence.prototype.setStatus = function (a) {
    this._setChildNode("status", a);
    return this;
};
JSJaCPresence.prototype.setShow = function (a) {
    if (a == "chat" || a == "away" || a == "xa" || a == "dnd") {
        this._setChildNode("show", a);
    }
    return this;
};
JSJaCPresence.prototype.setPriority = function (a) {
    this._setChildNode("priority", a);
    return this;
};
JSJaCPresence.prototype.setPresence = function (b, a, c) {
    if (b) {
        this.setShow(b);
    }
    if (a) {
        this.setStatus(a);
    }
    if (c) {
        this.setPriority(c);
    }
    return this;
};
JSJaCPresence.prototype.getStatus = function () {
    return this.getChildVal("status");
};
JSJaCPresence.prototype.getShow = function () {
    return this.getChildVal("show");
};
JSJaCPresence.prototype.getPriority = function () {
    return this.getChildVal("priority");
};

function JSJaCIQ() {
    this.base = JSJaCPacket;
    this.base("iq");
}

JSJaCIQ.prototype = new JSJaCPacket();
JSJaCIQ.prototype.setIQ = function (c, a, b) {
    if (c) {
        this.setTo(c);
    }
    if (a) {
        this.setType(a);
    }
    if (b) {
        this.setID(b);
    }
    return this;
};
JSJaCIQ.prototype.setQuery = function (c) {
    var a;
    try {
        a = this.getDoc().createElementNS(c, "query");
    } catch (b) {
        a = this.getDoc().createElement("query");
        a.setAttribute("xmlns", c);
    }
    this.getNode().appendChild(a);
    return a;
};
JSJaCIQ.prototype.getQuery = function () {
    return this.getNode().getElementsByTagName("query").item(0);
};
JSJaCIQ.prototype.getQueryXMLNS = function () {
    if (this.getQuery()) {
        return this.getQuery().namespaceURI || this.getQuery().getAttribute("xmlns");
    } else {
        return null;
    }
};
JSJaCIQ.prototype.reply = function (d) {
    var b = this.clone();
    b.setTo(this.getFrom());
    b.setFrom();
    b.setType("result");
    if (d) {
        if (typeof d == "string") {
            b.getChild().appendChild(b.getDoc().loadXML(d));
        } else {
            if (d.constructor == Array) {
                var c = b.getChild();
                for (var a = 0; a < d.length; a++) {
                    if (typeof d[a] == "string") {
                        c.appendChild(b.getDoc().loadXML(d[a]));
                    } else {
                        if (typeof d[a] == "object") {
                            c.appendChild(d[a]);
                        }
                    }
                }
            } else {
                if (typeof d == "object") {
                    b.getChild().appendChild(d);
                }
            }
        }
    }
    return b;
};

function JSJaCMessage() {
    this.base = JSJaCPacket;
    this.base("message");
}

JSJaCMessage.prototype = new JSJaCPacket();
JSJaCMessage.prototype.setBody = function (a) {
    this._setChildNode("body", a);
    return this;
};
JSJaCMessage.prototype.setSubject = function (a) {
    this._setChildNode("subject", a);
    return this;
};
JSJaCMessage.prototype.setThread = function (a) {
    this._setChildNode("thread", a);
    return this;
};
JSJaCMessage.prototype.getThread = function () {
    return this.getChildVal("thread");
};
JSJaCMessage.prototype.getBody = function () {
    return this.getChildVal("body");
};
JSJaCMessage.prototype.getSubject = function () {
    return this.getChildVal("subject");
};
JSJaCPacket.wrapNode = function (b) {
    var a = null;
    switch ( b.nodeName.toLowerCase() ) {
        case"presence":
            a = new JSJaCPresence();
            break;
        case"message":
            a = new JSJaCMessage();
            break;
        case"iq":
            a = new JSJaCIQ();
            break;
    }
    if (a) {
        a.getDoc().replaceChild(a._importNode(b, true), a.getNode());
    }
    return a;
};
var JSJaCUtils = {
    xor: function (d, b) {
        if (!d) {
            return b;
        }
        if (!b) {
            return d;
        }
        var a = "";
        for (var c = 0; c < d.length; c++) {
            a += String.fromCharCode(d.charCodeAt(c) ^ b.charCodeAt(c));
        }
        return a;
    }, cnonce: function (b) {
        var c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var d = "";
        for (var a = 0; a < b; a++) {
            d += c.charAt(Math.round(Math.random(new Date().getTime()) * (c.length - 1)));
        }
        return d;
    }, now: function () {
        if (Date.now && typeof Date.now == "function") {
            return Date.now();
        } else {
            return new Date().getTime();
        }
    }
};

function JSJaCWebSocketConnection(a) {
    this.base = JSJaCConnection;
    this.base(a);
    this._ws = null;
    this.registerHandler("onerror", JSJaC.bind(this._cleanupWebSocket, this));
}

JSJaCWebSocketConnection.prototype = new JSJaCConnection();
JSJaCWebSocketConnection.prototype._cleanupWebSocket = function () {
    if (this._ws !== null) {
        this._ws.onclose = null;
        this._ws.onerror = null;
        this._ws.onopen = null;
        this._ws.onmessage = null;
        this._ws.close();
        this._ws = null;
    }
};
JSJaCWebSocketConnection.prototype.connect = function (a) {
    this._setStatus("connecting");
    this.domain = a.domain || "localhost";
    this.username = a.username;
    this.resource = a.resource;
    this.pass = a.password || a.pass;
    this.authzid = a.authzid || "";
    this.register = a.register;
    this.authhost = a.authhost || this.domain;
    this.authtype = a.authtype || "sasl";
    this.jid = this.username + "@" + this.domain;
    this.fulljid = this.jid + "/" + this.resource;
    if (a.allow_plain) {
        this._allow_plain = a.allow_plain;
    } else {
        this._allow_plain = JSJAC_ALLOW_PLAIN;
    }
    if (a.allow_scram) {
        this._allow_scram = a.allow_scram;
    } else {
        this._allow_scram = JSJAC_ALLOW_SCRAM;
    }
    if (a.xmllang && a.xmllang !== "") {
        this._xmllang = a.xmllang;
    } else {
        this._xmllang = "en";
    }
    if (typeof WebSocket === "undefined") {
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    this._ws = new WebSocket(this._httpbase, "xmpp");
    this._ws.onclose = JSJaC.bind(this._onclose, this);
    this._ws.onerror = JSJaC.bind(this._onerror, this);
    this._ws.onopen = JSJaC.bind(this._onopen, this);
};
JSJaCWebSocketConnection.prototype._onopen = function () {
    var a = this._getInitialRequestString();
    this.oDbg.log(a, 4);
    this._ws.onmessage = JSJaC.bind(this._handleOpenStream, this);
    this._ws.send(a);
    this.setPing(this);
};
JSJaCWebSocketConnection.prototype.setPing = function (a) {
    if (a.pingIntervalTimer) {
        clearTimeout(a.pingIntervalTimer);
    }
    a.pingIntervalTimer = setTimeout(function () {
        if (a._ws) {
            a._ws.send("<iq type='get'><ping xmlns='urn:xmpp:ping'/></iq>");
            a.setPing(a);
        }
    }, JSJACPING_INTERVAL);
};
JSJaCWebSocketConnection.prototype._handleOpenStream = function (b) {
    var a, c;
    this.oDbg.log(b.data, 4);
    a = b.data;
    c = this._parseXml(a);
    if (!c) {
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    this.streamid = c.getAttribute("id");
    this.oDbg.log("got streamid: " + this.streamid, 2);
    this._ws.onmessage = JSJaC.bind(this._handleInitialResponse, this);
};
JSJaCWebSocketConnection.prototype._handleInitialResponse = function (a) {
    var b = this._parseXml(a.data);
    if (!this._parseStreamFeatures(b)) {
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
        return;
    }
    this._connected = true;
    if (this.register) {
        this._doInBandReg();
    } else {
        this._doAuth();
    }
};
JSJaCWebSocketConnection.prototype.disconnect = function () {
    this._setStatus("disconnecting");
    if (!this.connected()) {
        return;
    }
    this._connected = false;
    this.oDbg.log("Disconnecting", 4);
    this._sendRaw('<close xmlns="' + NS_FRAMING + '"/>', JSJaC.bind(this._cleanupWebSocket, this));
    this.oDbg.log("Disconnected", 2);
    this._handleEvent("ondisconnect");
};
JSJaCWebSocketConnection.prototype._onclose = function () {
    this.oDbg.log("websocket closed", 2);
    if (this._status !== "disconnecting") {
        this._connected = false;
        this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
    }
};
JSJaCWebSocketConnection.prototype._onerror = function () {
    this.oDbg.log("websocket error", 1);
    this._connected = false;
    this._handleEvent("onerror", JSJaCError("503", "cancel", "service-unavailable"));
};
JSJaCWebSocketConnection.prototype._onmessage = function (b) {
    var d, a, c;
    d = b.data;
    this._setStatus("processing");
    if (!d || d === "") {
        return;
    }
    a = this._parseXml(d);
    if (a.namespaceURI === NS_STREAM && a.localName === "error") {
        if (a.getElementsByTagNameNS(NS_STREAMS, "conflict").length > 0) {
            this._setStatus("session-terminate-conflict");
        }
        this._connected = false;
        this._handleEvent("onerror", JSJaCError("503", "cancel", "remote-stream-error"));
        return;
    }
    c = JSJaCPacket.wrapNode(a);
    if (!c) {
        return;
    }
    this.oDbg.log("async recv: " + b.data, 4);
    this._handleEvent("packet_in", c);
    if (c.pType && !this._handlePID(c)) {
        this._handleEvent(c.pType() + "_in", c);
        this._handleEvent(c.pType(), c);
    }
};
JSJaCWebSocketConnection.prototype._parseXml = function (a) {
    var c;
    this.oDbg.log("Parsing: " + a, 4);
    try {
        c = XmlDocument.create("stream", NS_STREAM);
        if (a.lastIndexOf("<close ", 0) === 0) {
            this.oDbg.log("session terminated", 1);
            clearTimeout(this._timeout);
            clearInterval(this._interval);
            clearInterval(this._inQto);
            try {
                JSJaCCookie.read(this._cookie_prefix + "JSJaC_State").erase();
            } catch (b) {
            }
            this._connected = false;
            this._handleEvent("onerror", JSJaCError("503", "cancel", "session-terminate"));
            this.oDbg.log("Disconnected.", 1);
            this._handleEvent("ondisconnect");
            return null;
        } else {
            c.loadXML(a);
            return c.documentElement;
        }
    } catch (b) {
        this.oDbg.log("Error: " + b);
        this._connected = false;
        this._handleEvent("onerror", JSJaCError("500", "wait", "internal-service-error"));
    }
    return null;
};
JSJaCWebSocketConnection.prototype._getInitialRequestString = function () {
    var a, b;
    a = this.domain;
    if (this.authhost) {
        a = this.authhost;
    }
    b = '<open xmlns="' + NS_FRAMING + '" to="' + a + '" version="1.0"/>';
    return b;
};
JSJaCWebSocketConnection.prototype.send = function (d, b, a) {
    if (!this.connected()) {
        return false;
    }
    if (!d || !d.pType) {
        this.oDbg.log("no packet: " + d, 1);
        return false;
    }
    this._ws.onmessage = JSJaC.bind(this._onmessage, this);
    if (b) {
        if (!d.getID()) {
            d.setID("JSJaCID_" + this._ID++);
        }
        this._registerPID(d, b, a);
    }
    try {
        this._handleEvent(d.pType() + "_out", d);
        this._handleEvent("packet_out", d);
        this._ws.send(d.xml());
    } catch (c) {
        this.oDbg.log(c.toString(), 1);
        return false;
    }
    return true;
};
JSJaCWebSocketConnection.prototype.resume = function () {
    return false;
};
JSJaCWebSocketConnection.prototype.suspend = function () {
    return false;
};
JSJaCWebSocketConnection.prototype._doSASLAuthScramSha1S1 = function (b) {
    var a = this._parseXml(b.data);
    return JSJaC.bind(JSJaCConnection.prototype._doSASLAuthScramSha1S1, this)(a);
};
JSJaCWebSocketConnection.prototype._doSASLAuthScramSha1S2 = function (b) {
    var a = this._parseXml(b.data);
    return JSJaC.bind(JSJaCConnection.prototype._doSASLAuthScramSha1S2, this)(a);
};
JSJaCWebSocketConnection.prototype._doSASLAuthDigestMd5S1 = function (b) {
    var a = this._parseXml(b.data);
    return JSJaC.bind(JSJaCConnection.prototype._doSASLAuthDigestMd5S1, this)(a);
};
JSJaCWebSocketConnection.prototype._doSASLAuthDigestMd5S2 = function (b) {
    var a = this._parseXml(b.data);
    return JSJaC.bind(JSJaCConnection.prototype._doSASLAuthDigestMd5S2, this)(a);
};
JSJaCWebSocketConnection.prototype._doSASLAuthDone = function (b) {
    var a = this._parseXml(b.data);
    return JSJaC.bind(JSJaCConnection.prototype._doSASLAuthDone, this)(a);
};
JSJaCWebSocketConnection.prototype._reInitStream = function (a) {
    var c, b = this.domain;
    if (this.authhost) {
        b = this.authhost;
    }
    c = '<open xmlns="' + NS_FRAMING + '" to="' + b + '" version="1.0"/>';
    this._sendRaw(c, a);
};
JSJaCWebSocketConnection.prototype._sendRaw = function (c, b, a) {
    if (!this._ws) {
        return false;
    }
    if (b) {
        this._ws.onmessage = JSJaC.bind(b, this, a);
    }
    this._ws.send(c);
    return true;
};
