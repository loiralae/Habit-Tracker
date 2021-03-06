// @flow

import React from 'react'
import { View, Text, ListView } from 'react-native'
import { connect } from 'react-redux'

// For empty lists
import AlertMessage from '../Components/AlertMessage'

// Styles
import styles from './Styles/ListviewExampleStyle'

export default class InstructionsView extends React.Component {
  state: {
    dataSource: Object
  }

  constructor (props) {
    super(props)
    /* ***********************************************************
    * STEP 1
    * This is an array of objects with the properties you desire
    * Usually this should come from Redux mapStateToProps
    *************************************************************/

    var dataObjects = []

    if (this.props.currentRecipe && this.props.currentRecipe.analyzedInstructions) {
      this.props.currentRecipe.analyzedInstructions.map((instruction) => {
        dataObjects.concat(instruction.steps)
      })
    }

    /* ***********************************************************
    * STEP 2
    * Teach datasource how to detect if rows are different
    * Make this function fast!  Perhaps something like:
    *   (r1, r2) => r1.id !== r2.id}
    *************************************************************/
    const rowHasChanged = (r1, r2) => r1 !== r2

    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRows(dataObjects)
    }
  }

  /* ***********************************************************
  * STEP 3
  * `renderRow` function -How each cell/row should be rendered
  * It's our best practice to place a single component here:
  *
  * e.g.
    return <MyCustomCell title={rowData.title} description={rowData.description} />
  *************************************************************/
  renderRow (rowData) {
    return (
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData}</Text>
        </View>
    )
  }

  /* ***********************************************************
  * STEP 4
  * If your datasource is driven by Redux, you'll need to
  * reset it when new data arrives.
  * DO NOT! place `cloneWithRows` inside of render, since render
  * is called very often, and should remain fast!  Just replace
  * state's datasource on newProps.
  *
  * e.g.
    componentWillReceiveProps (newProps) {
      if (newProps.someData) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(newProps.someData)
        })
      }
    }
  *************************************************************/

  componentWillReceiveProps (newProps) {
    var dataObjects = []
    if (newProps.currentRecipe && newProps.currentRecipe.analyzedInstructions) {
      newProps.currentRecipe.analyzedInstructions.map((instruction) => {
        dataObjects.push(instruction.name)
        instruction.steps.map((step) => {
            dataObjects.push(step.step)
        })
      })

      dataObjects = dataObjects.filter((str) => {
          return str.trim() != ""
      })

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataObjects)
      })
    }
  }

  render () {
    return (
        <View style={styles.container}>
          <ListView
            contentContainerStyle={styles.listContent}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
          />
        </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}
