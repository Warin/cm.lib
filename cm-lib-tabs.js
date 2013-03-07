/*!
 * CM Lib Tabs
 * @author      MGA
 * @version     0.1
 * @TODO history hooks
 * @TODO location hash hooks
 * @TODO ajax content loading 
 */
/*jslint devel: true, browser: true, sub: true, unparam: true, debug: false, white: true, maxerr: 999, indent: 4 */
/*global jQuery, escape, unescape */
(function(window,$,undefined) {
    "use strict";
    var Tabs=(function(){
        var config={
                tabs:".cm-tabs"
                ,tab:".head li"
                ,tabActive:"active"
                ,tabContent:".cm-tab"
            }
            ,gc=function(str){return "."+str;}
            ,getRoot=function(tab){
                return $(tab).parents(config.tabs);
            }
            ,getTabs=function(tabs){
                return $(tabs).find(config.tab);
            }
            ,getContents=function(tabs){
                return $(tabs).find(config.tabContent);
            }
        ;
        return {
            /**
             * Activates the first tab if it not set by markup
             * @return {jQuery collection} Tabs
             */
            setup:function(){
                var tabs=$(config.tabs);
                $(tabs).each(function(){
                    var 
                        tabs=getTabs(this)
                        ,active=tabs.filter(gc(config.tabActive))
                        ,idx=(!!active.length)?active.index():0
                    ;
                    return Tabs.setActive(this,idx);
                });
                return tabs;
            }
            /**
             * Highlight tab and show its content
             * @param {jQuery collection}   tabs [collection of tabs]
             * @param {integer}             idx  [index of the tab to highlight]
             */
            ,setActive:function(tabs,idx){
                getTabs(tabs).removeClass(config.tabActive).eq(idx).addClass(config.tabActive);
                getContents(tabs).hide().eq(idx).show();
                return tabs;
            }
            /**
             * Instanciate bindings
             * @return {boolean} true
             */
            ,bind:function(){
                $(config.tabs).find(config.tab).on("click","a",function(e){
                    e.preventDefault();
                    Tabs.setActive(getRoot(this),$(this).parent().index());
                });
                return true;
            }
            /**
             * Init method
             * @return Tabs
             */
            ,init:function(){
                Tabs.setup();
                Tabs.bind();
                return this;
            }
        };
    }());
    Tabs.init();
    var cm=window.CM||{};
        cm.Tabs=Tabs;
    window.CM=cm;
}(window,jQuery));

