from xml.etree import ElementTree as ET
from diesel import ontology
from nltk.corpus import wordnet as wn


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


def load_mappings(filename):
    entries = load_entries(filename)
    return [e.get_mappings() for e in entries]