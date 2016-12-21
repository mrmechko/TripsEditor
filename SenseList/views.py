from django.shortcuts import render

# Create your views here.
ont = ontology.load("ontologyfiles/lexicon/data")

def get_one(request):
    prop = WordProposal.objects.filter(is_solved=False).order_by('?').first()
    candidates = WordMapCandidate.objects.filter(proposal=prop)
