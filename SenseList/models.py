from django.db import models
from nltk.corpus import wordnet as wn


class WordProposal(models.Model):
    lemma = models.CharField(max_length=32)
    ont_type = models.CharField(max_length=64)
    is_solved = models.BooleanField(default=False)
    is_name = models.BooleanField(default=False)

    @staticmethod
    def load(lemma, ont_type):
        proposal = WordProposal.objects.filter(
            lemma=lemma
            ont_type=ont_type
            )
        if proposal:
            # If we already have a proposal don't add candidates
            return WordMapCandidates.objects.all().filter(proposal=proposal.first())
        else:
            proposal = WordProposal(
                lemma=lemma,
                ont_type=ont_type
            )
            proposal.save()
        candidates = []
        for sense in wn.synsets(lemma):
            res = WordMapCandidate(
                sense=sense.key,
                proposal=proposal
            )
            res.save()
            candidates.append(res)
        return candidates

    def is_solved(self):
        candidates = WordMapCandidate.objects.all().filter(proposal=self)
        self.is_solved = any([c.selected for c in candidates])
        self.save()


class WordMapCandidate(models.Model):
    sense = models.CharField(max_length=64)
    selected = models.BooleanField(default=False)
    proposal = models.ForeignKey(WordProposal)

    def get_additions(self, depth=-1):
        sk = wn.get_lemma_from_key(self.sense)
        if depth > 0:
            children = sk.closure(lambda x: x.hyponyms, depth=depth)
        else:
            children = sk.closure(lambda x: x.hyponyms())
        words = set()
        for c in children:
            words.update([l.name() for l in c.lemmas()])
        return words

    def confuses(self, ont):
        return ont.get_wordnet(self.sense)

    def solve(self, state=True):
        self.selected = state
        self.proposal.is_solved()
        self.save()
