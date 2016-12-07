var vm = new Vue({
  el: '#onttype',
  data: {
    name: 'root',
    node: ''
  },
  watch: {
    name: function(newNode) {
      return this.getOntType();
    }
  },
  methods: {
    getOntType: _.debounce(
      function() {
        var vm = this;
        axios.get('http://localhost:8000/ont/ontology/?node='+this.name)
          .then(function (response){
            console.log(response.data.name);
            vm.node = response.data;
          })
          .catch(function (error) {
            vm.node = error
          })
      }, 500)
  }
})
