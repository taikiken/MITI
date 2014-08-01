/**
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
    s.version = /*version*/"0.0.4"; // injected by build process

    /**
     * The build date for this release in UTC format.
     * @property buildDate
     * @type String
     * @static
     **/
    s.buildDate = /*date*/"Mon, 28 Jul 2014 06:46:12 GMT"; // injected by build process

})( this.MITI );
