from django.core.management.base import BaseCommand, CommandError

class Command(BaseCommand):
    help = "loads a list of ont mapping proposals.  File should be a naked html table for now"

    def add_arguments(self, parser):
        parser.add_argument(
            'sourcefile', type=str,
            help='the sourcefile for proposals'
        )

    def handle(self, *args, **options):
        from SenseList.readtable import load_entries
        from SenseList.models import WordProposal
        self.stdout.write('loading table from {}'.format(options['sourcefile']))
        entries = load_entries(options['sourcefile'])
        for e in entries:
            WordProposal.load(e.target, e.onttype)
        self.stdout.write('loading {} complete'.format(options['sourcefile']))
