import React, { Component } from 'react';
import axios from 'axios';

import {Cell, Grid} from 'react-mdl';
import { Textfield, Chip, Button} from 'react-mdl';

import {Card, CardTitle, CardText} from 'react-mdl'

class UChip extends Component {
  render () {
    const update = (this.props.update ?
      (e) => this.props.update(this.props.value) :
      () => {}
    )
    return (
      <Chip onClick={update}>
        {this.props.value}
      </Chip>
    )
  }
}

class UChipList extends Component {
  render () {
    var id = 0;
    const lst = this.props.elements.map(
      e => (
        <UChip
          value={e}
          update={this.props.update}
          key={id++}
        />
      )
    )

    return <div>{lst}</div>
  }
}

class UCardList extends Component {
  render () {
    return (
      <Card shadow={0}>
        <CardTitle>{this.props.title}</CardTitle>
        <CardText><UChipList
          elements={this.props.elements}
          update={this.props.update}
      /></CardText></Card>
    )
  }
}

class LexView extends Component {
  render () {
    const lexicon = (
      this.props.node.lexicon && this.props.node.lexicon.length > 0 ?
        <UCardList
          update={this.props.update_ont}
          elements={this.props.node.lexicon}
          title="Lexicon"
        /> :
        <div/>
    )

    const wordnet = (
      this.props.node.wordnet && this.props.node.wordnet.length > 0 ?
        <UCardList
          update={this.props.update_ont}
          elements={this.props.node.wordnet}
          title="wordnet"
        /> :
        <div/>
    )
    return (
      <div>
        {lexicon}
        {wordnet}
      </div>)
  }
}

class OntNode extends Component {
  render () {
    const name = (
      this.props.node.name ?
      <h5><Chip>{this.props.node.name}</Chip></h5> :
      <div/>
    )

    const parent = (
      this.props.node.parent ?
      (<h6>Parent: <UChip
          update={this.props.update_ont}
          value={this.props.node.parent}
        />
      </h6>) :
      <div/>
    )

    const children = (
      this.props.node.children && this.props.node.children.length > 0 ?
        (<UCardList
          title="children"
          elements={this.props.node.children}
          update={this.props.update_ont}
        />) : <div/>
    )

    const words = (
      this.props.node.words && this.props.node.words.length > 0 ?
        (<UCardList
          title="words"
          elements={this.props.node.words}
          update={this.props.update_lex}
        />) : <div/>
    )
    // words
    // wordnet senses
    return (
      <div>
        {name}
        {parent}
        {children}
        {words}
      </div>
    )
  }
}


class Lookup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ont_type: {},
      word: {}
    }

    //this.getDataFromClick = this.getDataFromClick.bind(this);
    //this.getData = this.getData.bind(this)
    this.lookup_ont = this.lookup_ont.bind(this);
    this.lookup_lex = this.lookup_lex.bind(this);
  }

  lookup_ont(ont) {
    const comp = this;
    // TODO: Add a debounce
    axios.get('/ont/ontology', {
      params: {
        node: ont
      }
    }).then(function (response) {
      comp.setState({
        ont_type: response.data
      });
    }).catch(function (err) {
      console.log(err)
    })
  }

  lookup_lex(lex) {
    const comp = this;
    // TODO: Add a debounce
    axios.get('/ont/word', {
      params: {
        word: lex
      }
    }).then(function (response) {
      comp.setState({
        word: response.data
      });
    }).catch(function (err) {
      console.log(err)
    })
  }

  render() {
    return (
      <Grid>
        <Cell col={6}>
          <h5>Ontology Lookup</h5>
          <div>
              <Textfield
                label='ontlookup'
                name='onttype'
                onChange={(e) => {e.preventDefault(); this.lookup_ont(e.target.value)}}
              />
          </div>
          <OntNode
            node={this.state.ont_type}
            update_ont={this.lookup_ont}
            update_lex={this.lookup_lex}
          />
        </Cell>
        <Cell col={6}>
          <h5>Lexicon Lookup</h5>
          <div>
              <Textfield
                label='lexicon lookup'
                name='lextype'
                onChange={(e) => {e.preventDefault(); this.lookup_lex(e.target.value)}}
              />
          </div>
          <LexView node={this.state.word} update_ont={this.lookup_ont}/>
        </Cell>
      </Grid>
    )}
}

export default Lookup;
