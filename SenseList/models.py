from django.db import models
from nltk.corpus import wordnet as wn

from django.contrib.auth.models import User


class WordProposal(models.Model):
    lemma = models.CharField(max_length=32)
    ont_type = models.CharField(max_length=64)
    solved = models.BooleanField(default=False)
    is_name = models.BooleanField(default=False)

    @staticmethod
    def load(lemma, ont_type):
        if ont_type is None:
            return []
        proposal = WordProposal.objects.filter(
            lemma=lemma,
            ont_type=ont_type.name
            )
        if proposal:
            # If we already have a proposal don't add candidates
            return WordMapCandidate.objects.all().filter(proposal=proposal.first())
        else:
            proposal = WordProposal(
                lemma=lemma,
                ont_type=ont_type.name
            )
            proposal.save()
        candidates = []
        for sense in wn.synsets(lemma):
            res = WordMapCandidate(
                sense=sense.lemmas()[0].key(),
                proposal=proposal
            )
            res.save()
            candidates.append(res)
        return candidates

    @staticmethod
    def filter_dead_onttypes(ont):
        pass

    def is_annotated(self):
        candidates = CandidateSelection.objects.all().filter(proposal=self)
        return self.is_name or candidates

    def is_solved(self, thresh=1):
        candidates = CandidateSelection.objects.all().filter(proposal=self)
        self.solved = self.is_name or len([c.candidate for c in candidates]) > 0
        self.save()
        return self.solved


class WordMapCandidate(models.Model):
    sense = models.CharField(max_length=64)
    proposal = models.ForeignKey(WordProposal, on_delete=models.CASCADE)

    def definition(self):
        return wn.lemma_from_key(self.sense).synset().definition()

    def get_additions(self, ont, depth=-1):
        """
        This gets too many things.  [y for y in x.hyponyms() if y not in ont.synset_map] should filter out those keys
        that have mappings already.  For some reason there are a small number of keys that bring ridiculous numbers of
        words to the mapping
        :param depth:
        :return:
        """
        sk = wn.lemma_from_key(self.sense).synset()
        if depth > 0:
            children = sk.closure(lambda x: [y for y in x.hyponyms() if y not in ont.synset_map], depth=depth)
        else:
            children = sk.closure(lambda x: [y for y in x.hyponyms() if y not in ont.synset_map])
        words = set([l.name() for l in sk.lemmas()])
        children = list(children)
        for c in children:
            words.update([l.name() for l in c.lemmas()])
        # words.add(str(len(children)))
        return sorted(list(words))

    def confuses(self, ont):
        return [n.name for n in ont.get_wordnet(self.sense)]

    def solve(self, user, state=True):
        if state:
            CandidateSelection.create(user, self)
        else:
            for cs in CandidateSelection.objects.filter(user=user, candidate=self):
                cs.delete()

    def selected_by(self):
        return [c.user.first_name for c in CandidateSelection.objects.filter(candidate=self)]


class CandidateSelection(models.Model):
    user = models.ForeignKey(User)
    candidate = models.ForeignKey(WordMapCandidate)
    proposal = models.ForeignKey(WordProposal)

    @staticmethod
    def create(user, candidate):
        sel = CandidateSelection(user=user, candidate=candidate, proposal=candidate.proposal)
        sel.save()
        return sel
