from xml.etree import ElementTree as ET
from diesel import ontology
from nltk.corpus import wordnet as wn

def get_vector(word):
    return vecmodel(word).vector

def avg(lst):
    return sum(lst)/len(lst)

class WordMap:
    def __init__(self):
        self.wn = {}
        self.word = {}
        words = set()
        for ss in wn.all_synsets():
            words.update([w.name() for w in ss.lemmas()])
        for w in words:
            wn_types = [d.name for d in ont.lookup(w, wordnet_only=True)]
            for d in wn_types:
                if d in self.wn:
                    self.wn[d].append(w)
                else:
                    self.wn[d] = [w]
        self.word = {
            d: n.words for d, n in ont.data.items()
        }

    def get(self, t):
        if type(t) is not str:
            t = t.name
        if t not in self.wn:
            self.wn[t] = []
        if t not in self.word:
            self.word[t] = []
        return {
                "wn": [w for w in self.wn[t]],
                "word": [w for w in self.word[t]]
            }

ont = ontology.load_ontology('/Users/rik/projects/trips/TripsEditor/ontologyfiles/lexicon/data')
wordmap = WordMap()

class WordnetMapping:
    def __init__(self, ont_type, synset, adds, target):
        self.target_ont = ont_type
        self.synset = synset
        self.adds = adds
        self.target = target
        self.confusion = ont.get_wordnet(self.synset)
        self._distance = -1

    @property
    def key(self):
        return self.synset.lemmas()[0].key()


    def __str__(self):
        if self.target_ont is None:
            return ""
        return """
        Mapping "{}" to "{}":
        \t{}: {}
        \tadds: [{}]
        \tcontains: [{}]
        \tconfuses: [{}]
        """.format(
            self.target, self.target_ont.name,
            self.key, self.synset.definition(),
            ", ".join(self.adds),
            ", ".join(self.target_ont.words),
            ", ".join([n.name for n in self.confusion])
        )


class Entry:
    def __init__(self, data_id, ont_type, words, target, ont):
        #self.id = data_id
        self.onttype = ont_type
        self.words = words
        self.target = target
        self.ont = ont

    @classmethod
    def load_from_tr(cls, data, ont):
        data_id = data['ID']
        ont_type = ont.get(data['New ONT Type'].lower())
        words = []
        if data['Current Words'] is not None:
            words = data['Current Words'].split(', ')
        target = data['Word'].lower()
        return cls(data_id, ont_type, words, target, ont)

    def get_possible_wordnet_mappings(self):
        """
        Get keys for word
        for each key in the hierarchy until another ont-type recieves an explicit
        mapping, return the key and all the words it would add to the ont node.
        Use WCD to order words
        """
        syns = wn.synsets(self.target)
        added = [self.get(syn) for syn in syns]
        res = {}
        for r in added:
            for key in r:
                if key in res:
                    res[key].update(r[key])
                else:
                    res[key] = r[key]
        return res

    def get_mappings(self):
        mappings = self.get_possible_wordnet_mappings()
        return [WordnetMapping(self.onttype, m, mappings[m], self.target)
                    for m in mappings]

    def get(self, syn, words=None, seen=None):
        if words is None:
            words = set()
        if seen is None:
            seen = set()
        results = self.ont.get_wordnet(syn, max_depth=1)

        seen.add(syn)

        words.update([str(lemma.name()) for lemma in syn.lemmas()])
        if results:
            return {syn: set([w for w in words])}
        up = [s for s in syn.hypernyms() if s not in seen]
        added = [self.get(y, set([w for w in words]), set([s for s in seen])) for y in up]
        res = {syn: set([w for w in words])}
        for r in added:
            for key in r:
                if key in res:
                    res[key].update(r[key])
                else:
                    res[key] = r[key]
        return res

def readtable(fname):
    table = ET.parse(fname).getroot()
    rows = iter(table)
    headers = [col.text for col in next(rows)]
    result = []
    for row in rows:
        values = [col.text for col in row]
        d = dict(zip(headers, values))
        result.append(d)
    return result

def load_entries(fname):
    return set([Entry.load_from_tr(r, ont) for r in readtable(fname)])


def load_mappings():
    entries = load_entries("table.html")
    return [e.get_mappings() for e in entries]


if __name__ == '__main__':
    test()
