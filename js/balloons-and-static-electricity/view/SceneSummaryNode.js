// Copyright 2016-2017, University of Colorado Boulder

/**
 * Scene summary for this sim.  The scene summary is composed of a dynamic list of descriptions
 * for parts of the play area and control panel.  This content will only ever be seen by a screen reader.
 * By breaking up the summary into a list of items, the user can find specific information about the
 * scene very quickly.
 *
 * TODO: Most of these functions should now use BalloonDescriber/SweaterDescriber/WallDescriber, there should be no
 * need for duplication.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var AccessibleSectionNode = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/AccessibleSectionNode' );
  var balloonsAndStaticElectricity = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloonsAndStaticElectricity' );
  var BASEA11yStrings = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/BASEA11yStrings' );
  var BASEDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/BASEDescriber' );
  var inherit = require( 'PHET_CORE/inherit' );
  var JoistA11yStrings = require( 'JOIST/JoistA11yStrings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var SweaterDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/SweaterDescriber' );
  var WallDescriber = require( 'BALLOONS_AND_STATIC_ELECTRICITY/balloons-and-static-electricity/view/describers/WallDescriber' );

  // strings
  var sceneSummaryString = BASEA11yStrings.sceneSummaryString;
  var openingSummaryString = BASEA11yStrings.openingSummaryString;
  var grabBalloonToPlayString = BASEA11yStrings.grabBalloonToPlayString;
  var andARemovableWallString = BASEA11yStrings.andARemovableWallString;
  var aSweaterString = BASEA11yStrings.aSweaterString;
  var andASweaterString = BASEA11yStrings.andASweaterString;
  var roomObjectsPatternString = BASEA11yStrings.roomObjectsPatternString;
  var checkOutShortcutsString = JoistA11yStrings.checkOutShortcutsString;
  var summaryObjectsString = BASEA11yStrings.summaryObjectsString;
  var aYellowBalloonString = BASEA11yStrings.aYellowBalloonString;
  var aGreenBalloonString = BASEA11yStrings.aGreenBalloonString;
  var summaryBalloonChargePatternString = BASEA11yStrings.summaryBalloonChargePatternString;
  var summaryEachBalloonChargePatternString = BASEA11yStrings.summaryEachBalloonChargePatternString;
  var zeroString = BASEA11yStrings.zeroString;
  var summaryObjectsHaveChargePatternString = BASEA11yStrings.summaryObjectsHaveChargePatternString;
  var summaryObjectChargePatternString = BASEA11yStrings.summaryObjectChargePatternString;
  var summarySweaterAndWallString = BASEA11yStrings.summarySweaterAndWallString;
  var summarySweaterWallPatternString = BASEA11yStrings.summarySweaterWallPatternString;
  var summarySecondBalloonInducingChargePatternString = BASEA11yStrings.summarySecondBalloonInducingChargePatternString;
  var summaryBothBalloonsPatternString = BASEA11yStrings.summaryBothBalloonsPatternString;
  var singleStatementPatternString = BASEA11yStrings.singleStatementPatternString;

  /**
   * @constructor
   * @param {BASEModel} model
   * @param wallNode
   * @param {Tandem} tandem
   */
  function SceneSummaryNode( model, yellowBalloonNode, greenBalloonNode, wallNode, tandem ) {

    var self = this;

    AccessibleSectionNode.call( this, sceneSummaryString, {
      tandem: tandem,
      pickable: false // scene summary (and its subtree) do not need to be pickable
    } );

    // pull out model elements for readability
    this.yellowBalloon = model.yellowBalloon;
    this.greenBalloon = model.greenBalloon;

    this.yellowBalloonDescriber = yellowBalloonNode.describer;
    this.greenBalloonDescriber = greenBalloonNode.describer;

    // @private
    this.model = model;
    this.wall = model.wall;

    // opening paragraph for the simulation
    var openingSummaryNode = new Node( { tagName: 'p', accessibleLabel: openingSummaryString } );
    this.addChild( openingSummaryNode );

    // list of dynamic description content that will update with the state of the simulation
    var listNode = new Node( { tagName: 'ul' } );
    var roomObjectsNode = new Node( { tagName: 'li' } );
    var balloonChargeNode = new Node( { tagName: 'li' } );
    var sweaterWallChargeNode = new Node( { tagName: 'li' } );
    var inducedChargeNode = new Node( { tagName: 'li' } );

    // structure the accessible content
    this.addChild( listNode );
    listNode.addChild( roomObjectsNode );
    listNode.addChild( balloonChargeNode );
    listNode.addChild( sweaterWallChargeNode );
    listNode.addChild( inducedChargeNode );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: grabBalloonToPlayString } ) );
    this.addChild( new Node( { tagName: 'p', accessibleLabel: checkOutShortcutsString } ) );

    // update the description that covers the visible objects in the play area
    Property.multilink( [ this.greenBalloon.isVisibleProperty, this.wall.isVisibleProperty ], function( balloonVisible, wallVisible ) {
      roomObjectsNode.accessibleLabel = SceneSummaryNode.getVisibleObjectsDescription( balloonVisible, wallVisible );
    } );

    var chargeProperties = [ this.yellowBalloon.chargeProperty, this.greenBalloon.chargeProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty ];
    Property.multilink( chargeProperties, function( yellowBalloonCharge, greenBalloonCharge, greenBalloonVisible, showCharges, wallVisible ) {
      var chargesVisible = showCharges !== 'none';
      balloonChargeNode.accessibleVisible = chargesVisible;
      sweaterWallChargeNode.accessibleVisible = chargesVisible;

      // update labels if charges are shown
      if ( chargesVisible ) {
        balloonChargeNode.accessibleLabel = self.getBalloonChargeDescription();
        sweaterWallChargeNode.accessibleLabel = self.getSweaterAndWallChargeDescription();
      }
    } );

    var inducedChargeProperties = [ this.yellowBalloon.locationProperty, this.greenBalloon.locationProperty, this.greenBalloon.isVisibleProperty, model.showChargesProperty, model.wall.isVisibleProperty ];
    Property.multilink( inducedChargeProperties, function( yellowLocation, greenLocation, greenVisible, showCharges, wallVisible ) {
      var inducingCharge = self.yellowBalloon.inducingChargeProperty.get() || self.greenBalloon.inducingChargeProperty.get();
      var showInducingItem = inducingCharge && wallVisible && showCharges === 'all';
      inducedChargeNode.accessibleVisible = showInducingItem;

      if ( showInducingItem ) {
        inducedChargeNode.accessibleLabel = self.getInducedChargeDescription();
      }
    } );
  }

  balloonsAndStaticElectricity.register( 'SceneSummaryNode', SceneSummaryNode );

  return inherit( AccessibleSectionNode, SceneSummaryNode, {

    /**
     * Get a description of the sweater and wall charge. Does not include induced charge. If the sweater has neutral
     * charge then the two objects can be described in a single statement for readability. Will return something like
     * "Sweater and wall have zero net charge, many pairs of negative and positive charges" or
     * "Sweater and wall have zero net charge, showing no charges" or
     * "Sweater has positive net charge, a few more positive charges than negative charges. Wall has zero net charge, many pairs of negative and positive charges." or
     * "Sweater has positive net charge, showing several positive charges. Wall has zero  net charge, showing several positive charges."
     *
     * @return {string}
     */
    getSweaterAndWallChargeDescription: function() {
      var description;

      var chargesShown = this.model.showChargesProperty.get();
      var wallVisible = this.model.wall.isVisibleProperty.get();
      var numberOfWallCharges = this.model.wall.numX * this.model.wall.numY;
      var wallChargeString = BASEDescriber.getNeutralChargesShownDescription( chargesShown, numberOfWallCharges );

      // if sweater has neutral charge, describe the sweater and wall together
      if ( this.model.sweater.chargeProperty.get() === 0 && wallVisible ) {
        var chargedObjectsString = StringUtils.fillIn( summaryObjectsHaveChargePatternString, {
          objects: summarySweaterAndWallString,
          charge: zeroString,
        } );

        // both have same described charge, can be described with wallChargeString
        description = StringUtils.fillIn( summaryObjectChargePatternString, {
          object: chargedObjectsString,
          charge: wallChargeString
        } );
      }
      else {
        var sweaterSummaryString = SweaterDescriber.getSummaryChargeDescription( chargesShown, this.model.sweater.chargeProperty.get() );

        // if the wall is visible, it also gets its own description
        if ( wallVisible ) {
          var wallSummaryString = WallDescriber.getSummaryChargeDescription( chargesShown, numberOfWallCharges );
          description = StringUtils.fillIn( summarySweaterWallPatternString, {
            sweater: sweaterSummaryString,
            wall: wallSummaryString
          } );
        }
        else {
          description = sweaterSummaryString;
        }
      }

      return description;
    },

    /**
     * Get a description which describes the charge of balloons in the simulation. Dependent on charge values, charge
     * visibility, and balloon visibility. Will return something like
     * 
     * "Yellow balloon has negative net charge, a few more negative charges than positive charges." or
     * “Yellow balloon has negative net charge, several more negative charges than positive charges. Green balloon has negative net charge, a few more negative charges than positive charges. Yellow balloon has negative net charge, showing several negative charges. Green balloon has negative net charge, showing a few negative charges.”
     *
     * @return {string}
     */
    getBalloonChargeDescription: function() {
      var description;

      var yellowChargeRange = BASEDescriber.getDescribedChargeRange( this.yellowBalloon.chargeProperty.get() );
      var greenChargeRange = BASEDescriber.getDescribedChargeRange( this.greenBalloon.chargeProperty.get() );

      var yellowRelativeCharge = this.yellowBalloonDescriber.getSummaryRelativeChargeDescription();
      var yellowNetCharge = this.yellowBalloonDescriber.getNetChargeDescriptionWithLabel();

      if ( !this.greenBalloon.isVisibleProperty.get() ) {
        description = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: yellowNetCharge,
          showingCharge: yellowRelativeCharge
        } );
      }
      else if ( this.greenBalloon.isVisibleProperty.get() && yellowChargeRange.equals( greenChargeRange ) ) {

        // both balloons visible have the same charge, describe charge together
        var eachNetCharge = BASEDescriber.getNetChargeDescriptionWithLabel( this.yellowBalloon.chargeProperty.get() );

        description = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: eachNetCharge,
          showingCharge: yellowRelativeCharge
        } );
      }
      else {

        // both balloons visible with different amounts of relative charge
        var greenRelativeCharge = this.greenBalloonDescriber.getSummaryRelativeChargeDescription();
        var greenNetCharge = this.greenBalloonDescriber.getNetChargeDescriptionWithLabel();

        var yellowBalloonDescription = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: yellowNetCharge,
          showingCharge: yellowRelativeCharge
        } );
        var greenBalloonDescription = StringUtils.fillIn( summaryBalloonChargePatternString, {
          balloonCharge: greenNetCharge,
          showingCharge: greenRelativeCharge
        } );

        description = StringUtils.fillIn( summaryEachBalloonChargePatternString, {
          yellowBalloon: yellowBalloonDescription,
          greenBalloon: greenBalloonDescription
        } );
      }

      return description;
    },

    getInducedChargeDescription: function() {
      var description;

      var yellowInducing = this.yellowBalloon.inducingChargeProperty.get();
      var greenInducing = this.greenBalloon.inducingChargeProperty.get();
      assert && assert( greenInducing || yellowInducing );

      var yellowBalloon = this.yellowBalloon;
      var yellowBalloonDescriber = this.yellowBalloonDescriber;
      var yellowBalloonLabel = yellowBalloonDescriber.accessibleLabel;

      var greenBalloon = this.greenBalloon;
      var greenBalloonDescriber = this.greenBalloonDescriber;
      var greenBalloonLabel = greenBalloonDescriber.accessibleLabel;

      var wallVisible = this.model.wall.isVisibleProperty.get();

      var greenInducingAndVisible = greenInducing && greenBalloon.isVisibleProperty.get();
      if ( greenInducingAndVisible && yellowInducing ) {

        if ( this.model.balloonsAdjacentProperty.get() ) {
          var combinedDescription = WallDescriber.getCombinedInducedChargeDescription( yellowBalloon, wallVisible, false );
          description = StringUtils.fillIn( singleStatementPatternString, { statement: combinedDescription } );
        }
        else {
          // full description for yellow balloon
          var yellowBalloonDescription = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabel, wallVisible, false );

          // short summary for green balloon
          var inducedChargeAmount = WallDescriber.getInducedChargeAmountDescription( greenBalloon );
          var greenBalloonDescription = StringUtils.fillIn( summarySecondBalloonInducingChargePatternString, {
            amount: inducedChargeAmount
          } );

          description = StringUtils.fillIn( summaryBothBalloonsPatternString, {
            yellowBalloon: yellowBalloonDescription,
            greenBalloon: greenBalloonDescription
          } );
        }
      }
      else {
        var singleBalloonDescription;
        if ( greenInducingAndVisible ) {
          singleBalloonDescription = WallDescriber.getInducedChargeDescription( greenBalloon, greenBalloonLabel, wallVisible, false );
        }
        else if ( yellowInducing ) {
          singleBalloonDescription = WallDescriber.getInducedChargeDescription( yellowBalloon, yellowBalloonLabel, wallVisible, false );
        }
        description = StringUtils.fillIn( singleStatementPatternString, { statement: singleBalloonDescription } );
      }

      return description;
    }
  }, {

    /**
     * Get a description of the objects that are currently visible in the sim.
     *
     * @private
     * @param  {Property.<boolean>} balloonVisible
     * @param  {Property.<boolean>} wallVisible
     * @return {string}
     */
    getVisibleObjectsDescription: function( balloonVisible, wallVisible ) {
      var placeholdersToRemove = [];
      !wallVisible && placeholdersToRemove.push( 'wall' );
      !balloonVisible && placeholdersToRemove.push( 'greenBalloon' );

      var sweaterString = wallVisible ? aSweaterString : andASweaterString;

      var patternString = BASEA11yStrings.stripPlaceholders( summaryObjectsString, placeholdersToRemove );
      var descriptionString = StringUtils.fillIn( patternString, {
        yellowBalloon: aYellowBalloonString,
        greenBalloon: aGreenBalloonString,
        sweater: sweaterString,
        wall: andARemovableWallString
      } );

      return StringUtils.fillIn( roomObjectsPatternString, {
        description: descriptionString
      } );
    }
  } );
} );