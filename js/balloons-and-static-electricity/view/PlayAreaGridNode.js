// Copyright 2002-2013, University of Colorado Boulder

/**
 * Node that shows the various regions of the play area for accessibility.  The play area is broken into
 * regions so that the balloons have unique descriptions depending on which region they are in.  In addition,
 * there are vertical and horizontal lines of significance that impact the output of the screen reader, and these
 * are drawn in the play area as well.
 *
 * This is not instrumented for phet-io because external users will not see or use it.
 *
 @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var PlayAreaMap = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/model/PlayAreaMap' );
  var Line = require( 'SCENERY/nodes/Line' );

  /**
   * @constructor
   * @param {Bounds2} layoutBounds - layout bounds of the screen view
   */
  function PlayAreaGridNode( layoutBounds, tandem ) {

    Node.call( this, { pickable: false } );
    var blueOptions = { fill: 'rgba(0,0,255,0.5)' };
    var greyOptions = { fill: 'rgba(200,200,200,0.5)' };

    var columns = PlayAreaMap.COLUMN_RANGES;
    var rows = PlayAreaMap.ROW_RANGES;

    // draw each column
    var self = this;
    var i = 0;
    var range;
    for ( range in columns ) {
      if ( columns.hasOwnProperty( range ) ) {
        if ( i % 2 === 0 ) {
          self.addChild( new Rectangle( columns[ range ].min, 0, columns[ range ].getLength(), PlayAreaMap.HEIGHT, blueOptions ) );
        }
        i++;
      }
    }

    // draw each row
    for ( range in rows ) {
      if ( rows.hasOwnProperty( range ) ) {
        if ( i % 2 === 0 ) {
          self.addChild( new Rectangle( 0, rows[ range ].min, PlayAreaMap.WIDTH, rows[ range ].getLength(), greyOptions ) );
        }
        i++;
      }
    }

    // draw the lines to along critical balloon locations along both x and y
    var lineOptions = { stroke: 'rgba(0, 0, 0,0.4)', lineWidth: 2, lineDash: [ 2, 4 ] };
    var xLocations = PlayAreaMap.X_LOCATIONS;
    var yLocations = PlayAreaMap.Y_LOCATIONS;
    var location;
    for ( location in xLocations ) {
      if ( xLocations.hasOwnProperty( location ) ) {
        self.addChild( new Line( xLocations[ location ], 0, xLocations[ location ], PlayAreaMap.HEIGHT, lineOptions ) );
      }
    }

    for ( location in yLocations ) {
      if ( yLocations.hasOwnProperty( location ) ) {
        self.addChild( new Line( 0, yLocations[ location ], PlayAreaMap.WIDTH, yLocations[ location ], lineOptions ) );
      }
    }
  }

  balloonsAndStaticElectricity.register( 'PlayAreaGridNode', PlayAreaGridNode );

  return inherit( Node, PlayAreaGridNode );
} );