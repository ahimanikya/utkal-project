import unittest
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).parent))
from build_workbench import model,normalized_url,ROOT

class WorkbenchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.report=model();cls.rows=cls.report['records']
    def test_frozen_selection_is_complete_and_has_reusable_evidence(self):
        self.assertEqual(len(self.rows),500)
        self.assertEqual(len({r['id'] for r in self.rows}),500)
        for r in self.rows:
            self.assertTrue((ROOT/r['knowledge_path']).is_file(),r['id'])
            self.assertTrue(r['next_actions'],r['id'])
            self.assertIn('evidence',r)
            self.assertNotIn('approved',r['stage'])
    def test_held_food_conflicts_are_retained(self):
        for identity in ['subject:food/kendrapara-rasabali','subject:food/dhenkanal-magji']:
            row=next(r for r in self.rows if r['id']==identity)
            self.assertIsNone(row['public_route'])
            self.assertTrue(any('discrep' in a.lower() or 'proportion' in a.lower() or 'sugar' in a.lower() or 'conflict' in a.lower() or 'vinegar' in a.lower() for a in row['next_actions']),row)
    def test_newer_research_is_visible_but_not_silently_added_to_frozen_batch(self):
        self.assertIn('subject:food/baigana-poda',self.report['additional_ids'])
        self.assertNotIn('subject:food/baigana-poda',{r['id'] for r in self.rows})
    def test_source_alias_normalization_keeps_editions_queries_and_schemes(self):
        self.assertNotEqual(normalized_url('https://x.test/book?edition=1987'),normalized_url('https://x.test/book?edition=1997'))
        self.assertEqual(normalized_url('https://x.test/book#page19'),'https://x.test/book')
        self.assertIsNone(normalized_url('javascript:alert(1)'))
    def test_shared_registry_url_does_not_attach_magji_to_rasabali(self):
        row=next(r for r in self.rows if r['id']=='subject:food/kendrapara-rasabali')
        self.assertNotIn('food-magji-gi178',{c['id'] for c in row['connections']})
    def test_existing_six_acres_page_is_linked_to_work_record(self):
        row=next(r for r in self.rows if r['id']=='subject:works/six-acres-and-a-third')
        self.assertEqual(row['public_route'],'/literature/six-acres-and-a-third/')

if __name__=='__main__':unittest.main()
