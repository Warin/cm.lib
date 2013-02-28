/*!
 * CM Cookies
 * @author      MGA
 * @version     0.2
 */
/*jslint devel: true, browser: true, sub: true, unparam: true, debug: false, white: true, maxerr: 999, indent: 4 */
/*global escape, unescape */
(function(window,undefined) {
    "use strict";
    /**
     * Cookie: cookies reader/writer framework with full unicode support.
     * @src:https://developer.mozilla.org/en-US/docs/DOM/document.cookie
     * @type {Object}
     * Cookie.set(name, value[ options ])
     * Cookie.set("key","value",{expires:new Date(new Date().getTime()+7*1000*60*60*24)});
     * Cookie.get(name)
     * Cookie.remove(name[, path])
     * Cookie.has(name)
     */
    var Cookie = {
        /**
         * Retrieve cookie value
         * @param  {String} name    cookie name to look for
         * @return {String}         if found: value of the cookie
         * @return {Null}           if not found: null
         */
        get:function(name){
            if (!name || !this.has(name)) { return null; }
            return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
        },
        /**
         * Set cookies
         * @param   {String} name     name of the cookie to set
         * @param   {String} value    value of the cookie to set
         * @param   {Object} options  optional: {expires:{String}, path:{String}, domain:{String}, Secure:{String}}
         * @return  {Object} Cookie
         */
        set:function(name, value, options){
            //opt={expires, path, domain, secure}
            if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) { return; }
            var expire_date = "";
            if (options&&options.expires) {
                switch (options.expires.constructor) {
                    case Number:
                        expire_date = (options.expires===Infinity) ? "; expires=Mon, 19 Jan 1970 01:00:00 GMT" : "; max-age=" + options.expires;
                        break;
                    case String:
                        expire_date = "; expires=" + options.expires;
                        break;
                    case Date:
                        expire_date = "; expires=" + options.expires.toGMTString();
                        break;
                }
            }
            document.cookie =   escape(name) + "=" + escape(value) + 
                                expire_date + 
                                ((options&&options.domain) ? "; domain=" + options.domain : "") + 
                                ((options&&options.path) ? "; path=" + options.path : "") + 
                                ((options&&options.secure) ? "; secure" : "");
            return this;
        },
        /**
         * Remove specified cookie
         * @param  {String} name    name of the cookie to be removed
         * @param  {String} path    optional path of the cookie to be removed
         * @return {Object} Cookie
         */
        remove:function(name, path){
            if (!name || !this.has(name)) { return; }
            return this.set(name,undefined,{expires:Infinity,path:(path?"; path="+path:"")});
        },
        /**
         * Check if specified cookie is set
         * @param  {String}  name   name of the cookie to look for
         * @return {Boolean}
         */
        has:function(name){
            return (new RegExp("(?:^|;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }
        /**
         * Test if cookies are supported
         * @return {[type]} [description]
         */
        ,test:function(){
            var t=(new Date().getTime())
                ,uid="cmcookie"+t
                ,acceptCookies=!!this.set(uid,t).has(uid)
            ;
            if (!acceptCookies) {return false;}
            //cleanup traces
            this.remove(uid);
            return true;
        }
    };
    var cm=window.CM||{Cookie:Cookie};
    window.CM=cm;
}(window));

