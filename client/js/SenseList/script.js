/**
 * Created by rik on 12/21/16.
 */


Vue.component("proposal",{
    props: ["proposal"],
    template: "\
    <div v-if='proposal.ont_type'>\
        <div class='proposal'>\
            <h1>Mapping {{proposal.lemma}} to {{proposal.ont_type}}</h1>\
        </div>\
     </div>\
     "
})

Vue.component("wordlist", {
    props: ["elements", "label"],
    template: "<div>" +
    "   <ul class='list-inline'>" +
    "       <li class='list-group-item-info'><span>{{label}}</span></li>" +
    "       <li class='list-inline-item' v-for='e in elements'>" +
    "           {{e}}" +
    "       </li>" +
    "   </ul>" +
    "</div>"
})

Vue.component("candidate", {
    props: ["candidate"],
    template: "" +
    "<div class='card card-block candidate'>" +
    "   <div class='key row card-title'>" +
    "       <h4>{{candidate.sense}}</h4>" +
    "       <h6 class='card-subtitle'>{{candidate.definition}}</h6>" +
    "   </div>" +
    "   <div class='card-text'>" +
    "   <div class='adds'>" +
    "       <wordlist :elements='candidate.adds' label='adds'></wordlist>" +
    "   </div>" +
    "   <div class='confuses'>" +
    "       <wordlist :elements='candidate.confuses' label='confuses'></wordlist>" +
    "   </div>" +
    "   <div class='selected_by'>" +
    "       <wordlist :elements='candidate.selected_by' label='selected by'></wordlist>" +
    "   </div>" +
    "   </div>" +
    "</div>"
})

Vue.component("candidatelist", {
    props: ["candidates"],
    template: "\
        <div class='candidatelist'>\
            <ul>\
                <div v-for=\"candidate in candidates\"> \
                    <candidate :candidate='candidate'></candidate> \
                </div> \
            </ul>\
        </div>\
  "
})

Vue.component("scaffold", {
    props: ["candidates", "proposal"],
    template: '<div>' +
    '<proposal :proposal="proposal"></proposal>' +
    '<candidatelist :candidates="candidates"></candidatelist>' +
    '</div>'
})

var vm = new Vue({
    el: '#app',
    data: { // initialize to false and then get onload
        proposal: false,
        candidates: false
    },
    methods: {
        getNextProposal: function (nme) {
            var vm = this;
            axios.get('/mapper/next/')
                .then(function (response) {
                    vm.proposal = response.data['proposal'];
                    vm.candidates = response.data['candidates'];
                })
                .catch(function (error) {
                    alert(error);
                })
        }
    }
})

vm.getNextProposal()