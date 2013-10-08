/*
 * CM Lib Collapsable
 * @author      MGA
 * @version     1.0.1
 * @revision    20130912    added support for dynamic content
 */
/*jslint devel: true, browser: true, sub: true, debug: false, white: true, maxerr: 999, indent: 4 */
/*global jQuery, escape, unescape */
(function(window,$,undefined) {
    "use strict";
    var Colex=(function(){
        var config={
                wrapper:".cm-colex"
               ,handle:".cm-colex-handle"
               ,colexOpen:"cm-colex-expanded"
            }
           ,gc=function(str){return "."+str;}
           ,getRoot=function(tab){
                return $(tab).parents(config.wrapper);
            }
        ;
        return {
            /**
             * Instanciate bindings
             * @return {boolean} true
             */
            bind:function(){
                $(config.wrapper).find(config.handle).live("click",function(e){
                    e.preventDefault();
                    getRoot(this).toggleClass(config.colexOpen);;
                    return false;
                });
                return true;
            }
            /**
             * Init method
             * @return Tabs
             */
           ,init:function(){
                Colex.bind();
                return this;
            }
        };
    }());
    Colex.init();
    var cm=window.CM||{};
    cm.Colex=Colex;
    window.CM=cm;
}(window,jQuery));

