var onttype_cache = {};
var wordcache = {}
var current_onttypes = [];

var messenger = new Vue()

Vue.component("ontname", {
  props: ["name"],
  template: "<button type=\"button\" class=\"btn btn-default\" v-on:click='emitOntType(name)'>{{ name }}</button>",
  methods: {
    emitOntType: function (t) {
      messenger.$emit('emitOntType', t)
    }
  }
})


Vue.component("list", {
  props: ["elements", "label"],
  template: "\
  <div>\
  <p>{{label}}</p>\
  <ul>\
    <li v-for=\"element in elements\"> \
      {{element}} \
    </li> \
  </ul>\
  </div>\
  "
})

Vue.component("ontlist", {
  props: ["elements", "label"],
  template: "\
  <div>\
  <p>{{label}}</p>\
  <ul>\
    <li v-for=\"element in elements\"> \
      <ontname :name='element'></ontname> \
    </li> \
  </ul>\
  </div>\
  "
})

Vue.component("ontnode", {
  props: ["node"],
  template: "\
  <div>\
    <ontname :name='node.name'></ontname>\
    <ontname :name='node.parent'></ontname>\
    <ontlist :elements='node.children' label='children'></ontlist>\
    <list :elements='node.words' label='words'></list>\
    <list :elements='node.wordnet' label='wordnet'></list>\
  </div>\
  "
})

var lookup = new Vue({
  el: "#wordlookup",
  data: {
    wnlist: [],
    lexlist: [],
    word: ''
  },
  watch: {
    word: function(word) {
      return this.lookup(this.word);
    }
  },
  methods: {
    lookup: _.debounce(
      function (word) {
        var lkp = this;
        if (word in wordcache) {
          lkp.wnlist = wordcache[nme]['wordnet'];
          lkp.lexlist = wordcache[nme]['lexicon'];
        } else {
          axios.get('/ont/word/?word='+word)
          .then(function (response){
            wordcache[word] = response.data;
            if (response.data != null) {
              lkp.wnlist = response.data.wordnet;
              lkp.lexlist = response.data.lexicon
            }
          })
          .catch(function (error) {
            alert("an error occurred while looking up a word")
          })
        }
      }, 500),
    registerGOT: function () {
      messenger.$on('emitWord', this.lookup)
    }
  }
})


var vm = new Vue({
  el: '#onttype',
  data: {
    name: 'root',
    node: {
      name: "root", parent: 'null', words: [], wordnet: [], children: ['any-sem']
    }
  },
  watch: {
    name: function(newNode) {
      return this.getOntType(this.name);
    }
  },
  methods: {
    getOntType: _.debounce(
      function (nme) {
        var vm = this;
        if (nme in onttype_cache) {
          vm.node = onttype_cache[nme];
        } else {
          axios.get('/ont/ontology/?node='+nme)
          .then(function (response){
            onttype_cache[nme] = response.data;
            if (response.data != null) {
              vm.node = response.data;
            }
          })
          .catch(function (error) {
            vm.node = error
          })
        }
      }, 500),
    registerGOT: function () {
      messenger.$on('emitOntType', this.getOntType)
    }
  }
})


vm.registerGOT()
lookup.registerGOT()
