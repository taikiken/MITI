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
    s.version = /*version*/"0.0.3"; // injected by build process

    /**
     * The build date for this release in UTC format.
     * @property buildDate
     * @type String
     * @static
     **/
    s.buildDate = /*date*/"Tue, 14 Jan 2014 12:12:09 GMT"; // injected by build process

})( this.MITI );
