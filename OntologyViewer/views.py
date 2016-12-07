from django.shortcuts import render
from django.http import JsonResponse
from diesel import ontology
from TripsEditor.settings import TripsXMLDir

from django.core.serializers.json import DjangoJSONEncoder

# Create your views here.

ont = ontology.load_ontology(TripsXMLDir)

def index(request):
    return render(request, "index.html", {})


class OnttypeEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, ontology.OntologyNode):
            return {
                'name': obj.name,
                'parent': obj.parent,
                'weight': obj.weight,
                'wordnet': obj.wordnet,
                'words': obj.words,
                'children': obj.children
            }
        return super(OnttypeEncoder, self).default(obj)


def json_type(request):
    node = request.GET.get('node', 'root')

    node = ont.get(node)
    return JsonResponse(node, safe=False, encoder=OnttypeEncoder)


def json_get_word(request):
    word = request.GET.get('word', None)
    depth = int(request.GET.get("depth", "-1"))
    if word is None:
        return JsonResponse([], safe=False)
    else:
        res = {
                'lexicon': [o.name for o in ont.get_word(word)],
                'wordnet': [o.name for o in ont.lookup(word, True, depth)]
            }
        return JsonResponse(res, safe=False)
