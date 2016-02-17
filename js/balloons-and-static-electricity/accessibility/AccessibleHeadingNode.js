// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node used to contain a heading element in the Parallel DOM.  By giving the element its own node, we can 
 * contain it and have full control of its location in the parallel DOM relative to other child elements.
 * 
 * This node is entirely invisible, other than its representation in the accessibility tree.
 * 
 * @author: Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  /**
   * Create a node that contains a heading so that users can use AT to quickly find content in the DOM
   * 
   * @param {string} headingLevel
   * @param {string} textContent
   * @constructor
   **/
  function AccessibleHeadingNode( headingLevel, textContent ) {

    var thisNode = this;

    Node.call( this, {
      accessibleContent: {
        createPeer: function( accessibleInstance ) {
          var trail = accessibleInstance.trail;
          this.node = trail.lastNode(); // @public (a11y)

          // heading element
          var headingElement = document.createElement( headingLevel );
          headingElement.textContent = textContent;
          headingElement.id = 'heading-node-' + this.node.id;
          thisNode.accessibleId = headingElement.id;

          return new AccessiblePeer( accessibleInstance, headingElement );
        }
      }
    } );
  }

  return inherit( Node, AccessibleHeadingNode );

} );