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
     * hash change 監視 singleton<br>
     * event params にイベント情報が設定されています。<br>
     *
     *     function onHashChange ( eventObj ) {
     *          var eventInfo = eventObj.params[ 0 ];
     *
     *          // eventInfo.hash {String} get query 付 xxx?12345
     *          // eventInfo.query {String} get query ?12345
     *          // eventInfo.key {String} hash key xxx
     *          // eventInfo.correct {boolean} hash key を信用リストと照合した結果
     *     }
     *
     *     var Annai = inazumatv.jq.ExternalJQ.imports( "Annai", window.jQuery );
     *     var annai = Annai.getInstance();
     *     annai.setUp( "http://example.com/PATH_TO_ROOT", [ "index", "test1", "test2" ], true );
     *
     *     annai.addEventListener( MITI.CHANGE, onHashChange );
     *
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
     * hashchange Event Handler<br>
     *
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
            this.dispatchEvent( new EventObject( MITI.CHANGE, {
                hash: hash,
                query: parameter,
                key: clean,
                correct: bool
            } ), this );
        }
    };

    /**
     * 初期設定をします。<br>
     * always に true が設定された場合hash change毎常にEvent Handlerが呼ばれます。<br>
     * defaultはfalseで信用リストと照合し真の場合のみ呼び出されます。
     *
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
     * URL基点を設定します
     * @method setRoot
     * @param {String} root 基点ロケーション
     */
    p.setRoot = function ( root ){
        _root = root;
    };

    /**
     *
     * @method getRoot
     * @returns {string} 設定された root を返します
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

}( MITI, window.inazumatv, window ) );