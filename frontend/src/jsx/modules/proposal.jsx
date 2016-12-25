import React, { Component } from 'react';
import axios from 'axios';

import {Chip, Card, CardTitle, CardText, Button, Icon} from 'react-mdl'


class ProposalView extends Component {
  render() {
    return(
        <h4>
            Mapping
            <Chip>{this.props.proposal.lemma}</Chip>
            to
            <Chip>{this.props.proposal.ont_type}</Chip>
        </h4>
    )
  }
}

class ChipList extends Component {
    render() {
        const lst = this.props.elements.map(
            (elt) => <Chip>{elt}</Chip>
        )
        return <div>{lst}</div>
    }
}

class CandidateView extends Component {
  render() {

   return (
       <Card shadow={0} className="CandidateCard">
         <CardTitle style={{borderBottom: 'solid gray 1px'}}>
             {this.props.candidate.definition}
         </CardTitle>
         <CardText>{this.props.candidate.sense}</CardText>
         <p>
             adds <ChipList elements={this.props.candidate.adds}/>
         </p>
         <p>confuses <ChipList elements={this.props.candidate.confuses}/></p>
         <p>selected by <ChipList elements={this.props.candidate.selected_by}/></p>
       </Card>
   )
  }
}

class ProposalViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proposal: {},
      candidates: []
    }

    this.getDataFromClick = this.getDataFromClick.bind(this);
    this.getData = this.getData.bind(this)
  }

  getData() {
    axios.get('http://localhost:8000/mapper/next/')
        .then(res => {
          const proposal = res.data.proposal;
          const candidates = res.data.candidates;
          this.setState({
            proposal: proposal,
            candidates: candidates
          });
        }).catch(function (error) {
          alert(error);
        });
  }

  getDataFromClick(e) {
    e.preventDefault();
    this.getData();
  }

  componentWillMount() {
    this.getData();
  }

  render() {
    const c = this.state.candidates.map((cand) => <CandidateView candidate={cand} key={cand.sense}></CandidateView>)
    return (
      <div className="App">
        <ProposalView proposal={this.state.proposal}></ProposalView>
        <Button ripple raised colored onClick={this.getDataFromClick}>skip</Button>
        {c}
      </div>
    );
  }
}

export default ProposalViewer;
