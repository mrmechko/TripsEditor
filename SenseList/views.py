from django.shortcuts import render
from django.http import JsonResponse
from SenseList.models import WordProposal, WordMapCandidate
from diesel import ontology
from TripsEditor.settings import BASE_DIR
from django.core.serializers.json import DjangoJSONEncoder

ont = ontology.load_ontology(BASE_DIR + "/ontologyfiles/lexicon/data")


class WMCEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if type(obj) is WordMapCandidate:
            return {
                "sense": obj.sense,
                "confuses": obj.confuses(ont),
                "adds": obj.get_additions(ont=ont),
                "definition": obj.definition(),
                "selected_by": obj.selected_by()
            }
        elif type(obj) is WordProposal:
            return {
                "lemma": obj.lemma,
                "ont_type": obj.ont_type,
                "solved": obj.is_solved(),
                "is_name": obj.is_name
            }
        return super(WMCEncoder, self).default(obj)



def get_one(request):
    print(request.user)
    seed = WordMapCandidate.objects.all().filter(proposal__solved=False).order_by('?').first()
    prop = seed.proposal
    candidates = WordMapCandidate.objects.filter(proposal=prop)

    return JsonResponse({
        "proposal": prop,
        "candidates": [c for c in candidates]
    }, safe=False, encoder=WMCEncoder)
