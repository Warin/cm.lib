/*!
 * CM Lib Tabs
 * @author      MGA
 * @version     1.4.0
 * @changelog   2013/08/26 - added external source for tab content (tabs bypass) + animation + history hook (where supported)
 * @changelog   2013/08/05 - added external source for tab content (via ajax)
 * @changelog   2013/07/26 - added link that trigger tabs activation a[href=#tabid].cm-tab-link
 * @changelog   2013/06/27 - Analytics Tracking
 * @changelog   2013/06/25 - location hash hooks
 */
/*jslint devel: true, browser: true, sub: true, unparam: true, debug: false, white: true, maxerr: 999, indent: 4, vars: true */
/*global jQuery, escape, unescape, dcsMultiTrack */
(function(window,$) {
    "use strict";
    var Tracker={
        getTracker:function(args){
            var tags=[],i;
            if (!args.tag) {
                return false;
                //automatic tracker of the tab
                /*var tabs_idx=$(args.link).parents(".cm-tabs").index(".cm-tabs")+1;//index of the current tab group
                var tab_idx=$(args.link).parent().index()+1;//index of the current tab in a tabgroup
                return ["DCS.dscuri",[document.location.pathname.replace(/\/en|fr|nl\/|\.aspx/gi,""),"_tab-",tabs_idx,"-",tab_idx].join("")];*/
            }
            //hardcoded tracker on the tab
            for (i in args.tag) {
                if (args.tag.hasOwnProperty(i)) {
                    tags.push(i,args.tag[i]);
                }
            }
            return tags;
        },
        track:function(link){
            var tag=$(link).data('tabTracker');
            if (typeof(dcsMultiTrack)==="undefined"){return false;}
            if (this.getTracker({tag:tag,link:link})===false){return false;}//automatic tracking disabled
            return dcsMultiTrack.apply(null,this.getTracker({tag:tag,link:link}));
        }
    };

    var Tabs=(function(){
        var booting=true;
        var config={
                tabs:".cm-tabs"
               ,tab:".head li"
               ,tabActive:"active"
               ,tabContent:".cm-tab"
               ,tabAside:".cm-tabs-head-aside"
               ,tabMeta:{title:".cm-tab-meta-title",aside:".cm-tab-meta-aside"}
               ,tabLink:".cm-tab-link"
               ,tabLoading:"cm-tab-loading"
               ,root:$('html,body')
            }
           ,gc=function(str){return "."+str;}
           ,getRoot=function(tab){
                return tab.parents(config.tabs);
            }
           ,getTabs=function(tabs){
                return tabs.find(config.tab);
            }
           ,getContents=function(tabs){
                return tabs.find(config.tabContent);
            }
           ,getContent=function(tab){
                return getRoot(tab).find(tab.find("a").attr("href"));
           }
           ,getLinksByHash=function(hash){
                return $(config.tabs).find(config.tab).find("a[href^='"+hash+"']");
           }
           ,getMeta=function(tab,meta){
                return $.trim(tab.find(meta).html());
            }
           ,setTitle=function(tab){
                //no text
                var title=getMeta(getContent(tab),config.tabMeta.title);
                if(!title){return true;}
                return tab.find("a").html(title);
            }
           ,setAside=function(tab){
                var root=getRoot(tab);
                var target=root.find(config.tabAside)||$("<div />").className(config.tabAside).appendTo(getRoot(tab).find(".head"));
                if (!root.data("booted")){
                    target.data("original-value",target.html());
                    root.data("booted",true);
                }
                //no aside
                var aside=getMeta(getContent(tab),config.tabMeta.aside)||target.data("original-value");
                return target.html(aside);
            }
           ,animate=function(elm){
                //animate tabs activation
                var target = getRoot(elm);
                config.root.animate({
                    scrollTop: target.offset().top
                }, 300, function () {
                    //window.location.hash = elm.attr("href");
                });
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
                        tabs=getTabs($(this))
                        ,active=tabs.filter(gc(config.tabActive))
                        ,idx=(!!active.length)?active.index():0
                    ;

                    //Setting title of tabs according to meta
                    getTabs($(this)).each(function(){setTitle($(this));});

                    //Activate active Tab
                    return Tabs.setActive($(this),idx);
                });
                return tabs;
            }
            /**
             * Highlight tab and show its content
             * @param {jQuery collection}   tabs [collection of tabs]
             * @param {integer}             idx  [index of the tab to highlight]
             */
           ,setActive:function(tabs,idx){
                var tabActive=getTabs(tabs).removeClass(config.tabActive).eq(idx).addClass(config.tabActive);
                
                //set Aside for active Tab
                setAside(tabActive);

                getContents(tabs).hide().eq(idx).show();
                return tabs;
            }
            /**
             * Instanciate bindings
             * @return {boolean} true
             */
           ,bind:function(){
                //click on tabs
                $(config.tabs).find(config.tab).on("click","a",function(e){
                    var link=$(this);

                    //links not to an anchor --> no tab activation, load as regular link
                    var inlineContent=(link.attr("href").indexOf("#")===0);
                    if (!inlineContent){return true;}

                    //link has tab-src data attribute --> content loaded by ajax
                    var ajaxContent=link.data("tabSrc")||false;
                    if (ajaxContent){
                        //set content
                        getContent(link.parent()).addClass(config.tabLoading).load(ajaxContent,function(response,status,xhr){
                            //error handling
                            if(status==="error"){$(this).html("Error loading tab: "+xhr.statusText);}
                            $(this).removeClass(config.tabLoading);
                        });
                    }

                    //activate tab
                    Tabs.setActive(getRoot(link),link.parent().index());
                    //animate(link);
                
                    Tracker.track(this);

                    //history hook
                    if (history.pushState){
                        history.pushState({"tab":link.attr("href")}, "Tab", link.attr("href"));
                    }
                    e.preventDefault();
                    
                    return false;
                });

                //link that trigger the tab click
                $("body").on("click",config.tabLink,function(e){
                    e.preventDefault();
                    var links=getLinksByHash($(this).attr("href"));
                    links.trigger("click");
                });

                //handle history hook
                $(window).bind("popstate",function(e){
                    var state=e.originalEvent.state||null;
                    if (!state){return false;}
                    var link=$(state.tab);
                    Tabs.setActive(getRoot(link),link.index());
                });
            }
            /**
             * Init method
             * @return Tabs
             */
           ,init:function(){
                Tabs.setup();
                Tabs.bind();


                //url loading
                var hash=window.location.hash;
                if (hash.length<2){return this;}//url ends with #
                var hashes=getLinksByHash(hash);
                if (hashes.length!==1){return this;}//many tabs could have the same id
                hashes.trigger("click");
                setTimeout(function(){window.scrollTo(0, 0);}, 10);//scrollback to top
                return this;
            }
        };
    }());
    Tabs.init();
    var cm=window.CM||{};
    cm.Tabs=Tabs;
    window.CM=cm;
}(window,jQuery));

