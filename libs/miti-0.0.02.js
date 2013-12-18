/**
 * license inazumatv.com
 * author (at)taikiken / htp://inazumatv.com
 * date 2013/12/18 - 10:59
 *
 * Copyright (c) 2011-2013 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * require inazumatv.util / https://github.com/taikiken/inazumatv, jQuery / http://jquery.com/, jquery.ba.hashchange / https://github.com/cowboy/jquery-hashchange
 */

var MITI = {};

/**
 * hash change event type
 * @for MITI
 * @const CHANGE
 * @type {string}
 * @static
 */
MITI.CHANGE = "mitiHashChange";/**
 * @module MITI
 */
(function( MITI ) {
    "use strict";

    /**
     * Static class holding library specific information such as the version and buildDate of
     * the library.
     * @class MITI
     **/
    var s = MITI.build = MITI.build || {};

    /**
     * The version string for this release.
     * @property version
     * @type String
     * @static
     **/
    s.version = /*version*/"0.0.01"; // injected by build process

    /**
     * The build date for this release in UTC format.
     * @property buildDate
     * @type String
     * @static
     **/
    s.buildDate = /*date*/"Wed, 18 Dec 2013 11:19:46 GMT"; // injected by build process

})( this.MITI );
/**
 * license inazumatv.com
 * author (at)taikiken / htp://inazumatv.com
 * date 2013/12/18 - 12:20
 *
 * Copyright (c) 2011-2013 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 *
 * require inazumatv.util, jQuery, jquery.ba.hashchange
 */
/**
 * @module inazumatv
 */
// ==================================
//  Annai
// ==================================
( function ( MITI, inazumatv, window ){
    "use strict";
    var EventObject = inazumatv.EventObject,
        EventDispatcher = inazumatv.EventDispatcher,

        eventStop,
        $;

    // ==================================
    // for Annai variables
    var  _hashString = "#!/",
        _trusts = [],
        _alreadySetUpped = false,
        _this,
        _root;

    /**
     * hash change 監視 singleton
     * @class Annai
     * @constructor
     * @returns {Annai} Annai instance を返します
     */
    function Annai () {
        if ( typeof $ === "undefined" || $ === null ) {
            // $ defined
            throw "Annai.activate first";
        }

        if ( typeof _this !== "undefined" ) {

            return _this;
        }

        var protocol, host;

        this._boundHashChange = this._onHashChange.bind( this );
        this._$window = $( window );
        _alreadySetUpped = false;
        protocol = window.location.protocol;
        host = window.location.hostname;
        this._server = protocol + "//" + host;
        this._protocol = protocol;
        this._host = host;

        _this = this;
        return _this;
    }

    /**
     * Annai instance を取得します
     * @returns {Annai} Annai instance を返します
     * @static
     */
    Annai.getInstance = function (){
        if ( typeof _this === "undefined" ) {

            _this = new Annai();
        }

        return _this;
    };

    /**
     * Annai へ jQuery object を設定。Annai を使用する前に実行する必要があります。<br>
     * ExternalJQ.imports から実行されます。
     *
     * @method activate
     * @param {jQuery} jQuery object
     * @static
     */
    Annai.activate = function ( jQuery ){
        $ = jQuery;
        inazumatv.jq.ExternalJQ.install( "HashChange", jQuery );
        eventStop = inazumatv.eventStop;
    };

    var p = Annai.prototype;

    /**
     * Adds the specified event listener.
     * @method addEventListener
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener An object with a handleEvent method, or a function that will be called when
     * the event is dispatched.
     * @return {Function | Object} Returns the listener for chaining or assignment.
     **/
    p.addEventListener = function ( type, listener ){};
    /**
     * Removes the specified event listener.
     * @method removeEventListener
     * @param {String} type The string type of the event.
     * @param {Function | Object} listener The listener function or object.
     **/
    p.removeEventListener = function (type, listener){};
    /**
     * Removes all listeners for the specified type, or all listeners of all types.
     * @method removeAllEventListeners
     * @param {String} [type] The string type of the event. If omitted, all listeners for all types will be removed.
     **/
    p.removeAllEventListeners = function (type){};
    /**
     * Indicates whether there is at least one listener for the specified event type.
     * @method hasEventListener
     * @param {String} type The string type of the event.
     * @return {Boolean} Returns true if there is at least one listener for the specified event.
     **/
    p.hasEventListener = function (type){};
    /**
     * Dispatches the specified event.
     * @method dispatchEvent
     * @param {Object | String} eventObj An object with a "type" property, or a string type. If a string is used,
     * dispatchEvent will construct a generic event object with "type" and "params" properties.
     * @param {Object} [target] The object to use as the target property of the event object. This will default to the
     * dispatching object.
     * @return {Boolean} Returns true if any listener returned true.
     **/
    p.dispatchEvent = function (eventObj, target){};

    // EventDispatcher mixin
    EventDispatcher.initialize( p );

    /**
     * hashchange Event Handler
     * @method _onHashChange
     * @param {Event} e Event instance
     * @private
     */
    p._onHashChange = function ( e ){
        eventStop( e );

        // get hash
        var hash = this._hash(),
            clean = this._clean(),
            parameter = this._parameter(),
            bool = this._validate( clean );

        if ( this._always || bool ) {
            this.dispatchEvent( new EventObject( MITI.CHANGE, [ hash, parameter, clean, bool ] ), this );
        }
    };

    /**
     * 初期設定をします
     * @method setUp
     * @param {String} root http://example.com/#!/index
     * @param {Array.<String>} list [ hashName... ]
     * @param {Boolean} [always] default false, optional
     */
    p.setUp = function ( root, list, always ){
        // one time
        if ( _alreadySetUpped ) {
            return;
        }

        this.setRoot( root );
        this.setTrust( list );
        this._always = !!always;
        this._$window.on( "hashchange", this._boundHashChange );
        _alreadySetUpped = true;
    };

    /**
     * kick hash event
     * @method fire
     */
    p.fire = function (){
        this._$window.trigger( "hashchange" );
    };

    // ==============================================
    // property get / set

    // -- hash string
    /**
     * 現在設定されている hash 値を取得
     * @method getHashString
     * @returns {string} 現在設定されている hash 値を返します
     */
    p.getHashString = function (){
        return _hashString;
    };

    /**
     * hash 値を設定
     * @method setHashString
     * @param {string} hash hash 値, "#!/"
     */
    p.setHashString = function ( hash ){
        _hashString = hash;
    };

    // -- protocol
    /**
     *
     * @method getProtocol
     * @returns {string|*} protocol, http: or https: を返します
     */
    p.getProtocol = function (){
        return this._protocol;
    };

    // -- host
    /**
     *
     * @method getHost
     * @returns {string|*} host name を返します
     */
    p.getHost = function (){
        return this._host;
    };

    // -- server
    /**
     *
     * @method getServer
     * @returns {string|*} http://example.com 形式の URLを返します
     */
    p.getServer = function (){
        return this._server;
    };

    // -- root
    /**
     * domainを除いた基点を設定します
     * @method setRoot
     * @param {String} root 基点ロケーション
     */
    p.setRoot = function ( root ){
        _root = root;
    };

    /**
     *
     * @method getRoot
     * @returns {string|*} root を返します
     */
    p.getRoot = function (){
        return _root;
    };

    // -- trust
    /**
     * 信用できるlocation listを設定します
     * @method setTrust
     * @param {Array} list url list 拡張子なし
     */
    p.setTrust = function ( list ){
        _trusts = list.slice( 0 );
    };

    /**
     *
     * @method getTrust
     * @returns {Array} 信用できるhashリストを返します
     */
    p.getTrust = function (){
        return _trusts;
    };

    // -- hash value
    /**
     *
     * @method getHash
     * @returns {String} 現在のhash値を返す
     */
    p.getHash  = function (){
        return this._clean();
    };

    // check hash
    /**
     *
     * @method isCorrect
     * @returns {boolean} 現在のhashを信用できる？
     */
    p.isCorrect = function (){
        return this._validate( this._hash() );
    };

    // ==============================================
    // private

    /**
     *
     * @method _validate
     * @param {String} hash hash値を渡します
     * @returns {boolean} hashを_trustsと比較し真偽値を返します
     * @private
     */
    p._validate = function ( hash ){
        return _trusts.indexOf( hash ) !== -1;
    };

    /**
     *
     * @method _hashString
     * @returns {String} hash(#!/)以降のリストを返します
     * @private
     */
    p._hash = function (){
        var hash = window.location.hash;

        if ( hash.indexOf( _hashString ) === -1 ) {
//            // for IE 6 history back problem
//            if ( hash.indexOf( "#" ) !== -1 && !hash.split( "#" ).pop() ) {
////                window.location.href = window.location.href.split( "#" ).shift();
//                window.location.href = this.getRoot();
////                alert( this.getRoot() );
//                return "";
//            }
            return hash;
        } else {
            return window.location.hash.split( _hashString ).pop();
        }
    };

    /**
     *
     * @method _parameter
     * @returns {string} get parameter を"?"付きで返します
     * @private
     */
    p._parameter = function (){
//        var hash = this._hash();
        var hash = window.location.href;

        if ( hash.indexOf( "?" ) === -1 ) {
            return "";
        } else {
            return "?" + hash.split( "?" ).pop();
        }
    };

    /**
     * get parameter を url から削除
     * @method setUp
     * @param {String} loc location string
     * @returns {String} get parameter を削除したurlを返します
     * @private
     */
    p._strip = function ( loc ){
        if ( loc.indexOf( "?" ) === -1 ) {
            return loc;
        } else {
            return loc.split( "?" ).shift();
        }
    };

    /**
     * get parameter を hash から削除
     * @method _clean
     * @returns {String}
     * @private
     */
    p._clean = function (){
        return this._strip( this._hash() );
    };

    inazumatv.jq.Annai = Annai;

}( MITI, window.inazumatv, window ) );/**
 * license inazumatv.com
 * author (at)taikiken / htp://inazumatv.com
 * date 2013/12/18 - 11:11
 *
 * Copyright (c) 2011-2013 inazumatv.com, inc.
 *
 * Distributed under the terms of the MIT license.
 * http://www.opensource.org/licenses/mit-license.html
 *
 * This notice shall be included in all copies or substantial portions of the Software.
 */
/**
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
( function ( inazumatv ){
    "use strict";
    var document = window.document,
        Browser = inazumatv.Browser
    ;

    function HashChange () {
        throw "HashChange cannot be instantiated";
    }

    HashChange.activate = function ( jQuery ){
        var $ = jQuery;

        '$:nomunge'; // Used by YUI compressor.

        // Reused string.
        var str_hashchange = 'hashchange',

        // Method / object references.
            doc = document,
            fake_onhashchange,
            special = $.event.special,

        // Does the browser support window.onhashchange? Note that IE8 running in
        // IE7 compatibility mode reports true for 'onhashchange' in window, even
        // though the event isn't supported, so also test document.documentMode.
            doc_mode = doc.documentMode,
            supports_onhashchange = 'on' + str_hashchange in window && ( doc_mode === undefined || doc_mode > 7 );


        // Get location.hash (or what you'd expect location.hash to be) sans any
        // leading #. Thanks for making this necessary, Firefox!
        function get_fragment( url ) {
            url = url || location.href;
            return '#' + url.replace( /^[^#]*#?(.*)$/, '$1' );
        }

        // Method: jQuery.fn.hashchange
        //
        // Bind a handler to the window.onhashchange event or trigger all bound
        // window.onhashchange event handlers. This behavior is consistent with
        // jQuery's built-in event handlers.
        //
        // Usage:
        //
        // > jQuery(window).hashchange( [ handler ] );
        //
        // Arguments:
        //
        //  handler - (Function) Optional handler to be bound to the hashchange
        //    event. This is a "shortcut" for the more verbose form:
        //    jQuery(window).bind( 'hashchange', handler ). If handler is omitted,
        //    all bound window.onhashchange event handlers will be triggered. This
        //    is a shortcut for the more verbose
        //    jQuery(window).trigger( 'hashchange' ). These forms are described in
        //    the <hashchange event> section.
        //
        // Returns:
        //
        //  (jQuery) The initial jQuery collection of elements.

        // Allow the "shortcut" format $(elem).hashchange( fn ) for binding and
        // $(elem).hashchange() for triggering, like jQuery does for built-in events.
        $.fn[ str_hashchange ] = function( fn ) {
            return fn ? this.bind( str_hashchange, fn ) : this.trigger( str_hashchange );
        };

        // Property: jQuery.fn.hashchange.delay
        //
        // The numeric interval (in milliseconds) at which the <hashchange event>
        // polling loop executes. Defaults to 50.

        // Property: jQuery.fn.hashchange.domain
        //
        // If you're setting document.domain in your JavaScript, and you want hash
        // history to work in IE6/7, not only must this property be set, but you must
        // also set document.domain BEFORE jQuery is loaded into the page. This
        // property is only applicable if you are supporting IE6/7 (or IE8 operating
        // in "IE7 compatibility" mode).
        //
        // In addition, the <jQuery.fn.hashchange.src> property must be set to the
        // path of the included "document-domain.html" file, which can be renamed or
        // modified if necessary (note that the document.domain specified must be the
        // same in both your main JavaScript as well as in this file).
        //
        // Usage:
        //
        // jQuery.fn.hashchange.domain = document.domain;

        // Property: jQuery.fn.hashchange.src
        //
        // If, for some reason, you need to specify an Iframe src file (for example,
        // when setting document.domain as in <jQuery.fn.hashchange.domain>), you can
        // do so using this property. Note that when using this property, history
        // won't be recorded in IE6/7 until the Iframe src file loads. This property
        // is only applicable if you are supporting IE6/7 (or IE8 operating in "IE7
        // compatibility" mode).
        //
        // Usage:
        //
        // jQuery.fn.hashchange.src = 'path/to/file.html';

        $.fn[ str_hashchange ].delay = 50;
        /*
         $.fn[ str_hashchange ].domain = null;
         $.fn[ str_hashchange ].src = null;
         */

        // Event: hashchange event
        //
        // Fired when location.hash changes. In browsers that support it, the native
        // HTML5 window.onhashchange event is used, otherwise a polling loop is
        // initialized, running every <jQuery.fn.hashchange.delay> milliseconds to
        // see if the hash has changed. In IE6/7 (and IE8 operating in "IE7
        // compatibility" mode), a hidden Iframe is created to allow the back button
        // and hash-based history to work.
        //
        // Usage as described in <jQuery.fn.hashchange>:
        //
        // > // Bind an event handler.
        // > jQuery(window).hashchange( function(e) {
        // >   var hash = location.hash;
        // >   ...
        // > });
        // >
        // > // Manually trigger the event handler.
        // > jQuery(window).hashchange();
        //
        // A more verbose usage that allows for event namespacing:
        //
        // > // Bind an event handler.
        // > jQuery(window).bind( 'hashchange', function(e) {
        // >   var hash = location.hash;
        // >   ...
        // > });
        // >
        // > // Manually trigger the event handler.
        // > jQuery(window).trigger( 'hashchange' );
        //
        // Additional Notes:
        //
        // * The polling loop and Iframe are not created until at least one handler
        //   is actually bound to the 'hashchange' event.
        // * If you need the bound handler(s) to execute immediately, in cases where
        //   a location.hash exists on page load, via bookmark or page refresh for
        //   example, use jQuery(window).hashchange() or the more verbose
        //   jQuery(window).trigger( 'hashchange' ).
        // * The event can be bound before DOM ready, but since it won't be usable
        //   before then in IE6/7 (due to the necessary Iframe), recommended usage is
        //   to bind it inside a DOM ready handler.

        // Override existing $.event.special.hashchange methods (allowing this plugin
        // to be defined after jQuery BBQ in BBQ's source code).
        special[ str_hashchange ] = $.extend( special[ str_hashchange ], {

            // Called only when the first 'hashchange' event is bound to window.
            setup: function() {
                // If window.onhashchange is supported natively, there's nothing to do..
                if ( supports_onhashchange ) { return false; }

                // Otherwise, we need to create our own. And we don't want to call this
                // until the user binds to the event, just in case they never do, since it
                // will create a polling loop and possibly even a hidden Iframe.
                $( fake_onhashchange.start );
            },

            // Called only when the last 'hashchange' event is unbound from window.
            teardown: function() {
                // If window.onhashchange is supported natively, there's nothing to do..
                if ( supports_onhashchange ) { return false; }

                // Otherwise, we need to stop ours (if possible).
                $( fake_onhashchange.stop );
            }

        });

        // fake_onhashchange does all the work of triggering the window.onhashchange
        // event for browsers that don't natively support it, including creating a
        // polling loop to watch for hash changes and in IE 6/7 creating a hidden
        // Iframe to enable back and forward.
        fake_onhashchange = (function(){
            var self = {},
                timeout_id,

            // Remember the initial hash so it doesn't get triggered immediately.
                last_hash = get_fragment(),

                fn_retval = function(val){ return val; },
                history_set = fn_retval,
                history_get = fn_retval;

            // Start the polling loop.
            self.start = function() {
                timeout_id || poll();
            };

            // Stop the polling loop.
            self.stop = function() {
                timeout_id && clearTimeout( timeout_id );
                timeout_id = undefined;
            };

            // This polling loop checks every $.fn.hashchange.delay milliseconds to see
            // if location.hash has changed, and triggers the 'hashchange' event on
            // window when necessary.
            function poll() {
                var hash = get_fragment(),
                    history_hash = history_get( last_hash );

                // ----------------------
                // history back 時に # で汚染する対策
                if ( hash === "#" ) {
                    hash = "";
                }
                if ( history_hash === "#" ) {
                    history_hash = "";
                }
                // ----------------------

                if ( hash && hash !== last_hash ) {
                    history_set( last_hash = hash, history_hash );

                    $(window).trigger( str_hashchange );

                } else if ( history_hash !== last_hash ) {
                    location.href = location.href.replace( /#.*/, '' ) + history_hash;
                }

                timeout_id = setTimeout( poll, $.fn[ str_hashchange ].delay );
            }//poll

            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
//            $.browser.msie && !supports_onhashchange && (function(){
            Browser.IE.legacy() && !supports_onhashchange && (function(){
                // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
                // when running in "IE7 compatibility" mode.

                var iframe,
                    iframe_src;

                // When the event is bound and polling starts in IE 6/7, create a hidden
                // Iframe for history handling.
                self.start = function(){
                    if ( !iframe ) {
                        iframe_src = $.fn[ str_hashchange ].src;
                        iframe_src = iframe_src && iframe_src + get_fragment();

                        // Create hidden Iframe. Attempt to make Iframe as hidden as possible
                        // by using techniques from http://www.paciellogroup.com/blog/?p=604.
                        iframe = $('<iframe tabindex="-1" title="empty"/>').hide()

                            // When Iframe has completely loaded, initialize the history and
                            // start polling.
                            .one( 'load', function(){
                                iframe_src || history_set( get_fragment() );
                                poll();
                            })

                            // Load Iframe src if specified, otherwise nothing.
                            .attr( 'src', iframe_src || 'javascript:0' )

                            // Append Iframe after the end of the body to prevent unnecessary
                            // initial page scrolling (yes, this works).
                            .insertAfter( 'body' )[0].contentWindow;

                        // Whenever `document.title` changes, update the Iframe's title to
                        // prettify the back/next history menu entries. Since IE sometimes
                        // errors with "Unspecified error" the very first time this is set
                        // (yes, very useful) wrap this with a try/catch block.
                        doc.onpropertychange = function(){
                            try {
                                if ( event.propertyName === 'title' ) {
                                    iframe.document.title = doc.title;
                                }
                            } catch(e) {}
                        };

                    }
                };

                // Override the "stop" method since an IE6/7 Iframe was created. Even
                // if there are no longer any bound event handlers, the polling loop
                // is still necessary for back/next to work at all!
                self.stop = fn_retval;

                // Get history by looking at the hidden Iframe's location.hash.
                history_get = function() {
                    return get_fragment( iframe.location.href );
                };

                // Set a new history item by opening and then closing the Iframe
                // document, *then* setting its location.hash. If document.domain has
                // been set, update that as well.
                history_set = function( hash, history_hash ) {
                    // ----------------------
                    // history back 時に # で汚染する対策
                    if ( hash === "#" && typeof history_hash === "undefined" ) {
                        hash = "";
                    }
                    // ----------------------
                    var iframe_doc = iframe.document,
                        domain = $.fn[ str_hashchange ].domain;

                    if ( hash !== history_hash ) {
                        // Update Iframe with any initial `document.title` that might be set.
                        iframe_doc.title = doc.title;

                        // Opening the Iframe's document after it has been closed is what
                        // actually adds a history entry.
                        iframe_doc.open();

                        // Set document.domain for the Iframe document as well, if necessary.
                        domain && iframe_doc.write( '<script>document.domain="' + domain + '"</script>' );

                        iframe_doc.close();

                        // Update the Iframe's hash, for great justice.
                        iframe.location.hash = hash;
                    }
                };

            })();
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            return self;
        })();//fake_onhashchange
    };

    inazumatv.jq.HashChange = HashChange;
}( this.inazumatv ) );