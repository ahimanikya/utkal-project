"""Extract the two unmodified ORGI workbooks with Python's standard library.

The original rows and hierarchy, not a language-name heuristic, define counts.
No source workbook is edited. Output retains source sheet rows for inspection.
"""
from pathlib import Path
from collections import defaultdict
import argparse, hashlib, json, re, zipfile
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
DATA=ROOT/'kb/research/voices/population-2011.json'
NS={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
FIELDS=['persons','males','females','rural_persons','rural_males','rural_females','urban_persons','urban_males','urban_females']

def cells(path):
    with zipfile.ZipFile(path) as z:
        strings=[''.join(si.itertext()) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si',NS)]
        sheet=ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        for row in sheet.findall('s:sheetData/s:row',NS):
            values=[None]*17
            for c in row.findall('s:c',NS):
                letters=re.match('[A-Z]+',c.attrib['r'])[0];col=0
                for char in letters:col=col*26+ord(char)-64
                v=c.find('s:v',NS)
                if v is not None:
                    raw=v.text;values[col-1]=strings[int(raw)] if c.attrib.get('t')=='s' else int(raw) if raw and raw.isdigit() else raw
            yield int(row.attrib['r']),values

def counts(vals):
    assert len(vals)==9 and all(isinstance(x,int) and x>=0 for x in vals),vals
    p,m,f,r,rm,rf,u,um,uf=vals
    assert p==m+f and r==rm+rf and u==um+uf and p==r+u and m==rm+um and f==rf+uf
    return vals

def build():
    c16=ROOT/'kb/research/references/census-2011/c16-odisha.xlsx'
    c17=ROOT/'kb/research/references/census-2011/c17-odisha.xlsx'
    all_rows=[];areas={};labels={};lookup={}
    for row,v in cells(c16):
        if v[0]!='C0116':continue
        assert v[1]=='21'
        code=str(v[5]).zfill(6);vals=counts(v[7:16]);all_rows.append((row,v,code,vals))
        if v[3]!='00000':continue
        area=str(v[2]).zfill(3);a=areas.setdefault(area,{'code':area,'name':v[4].strip(),'rows':{}})
        assert code not in a['rows'];a['rows'][code]={'values':vals,'source_row':row}
        lookup[(area,code)]=vals
        if area=='000':labels[code]={'code':code,'label':re.sub(r'^\d+\s+','',v[6].strip()),'source_label':v[6].strip(),'level':'language_group' if code.endswith('000') else 'mother_tongue','parent':None if code.endswith('000') else code[:3]+'000'}
    assert len(areas)==31
    groups=[c for c in labels if c.endswith('000')]
    for a in areas.values():
        a['population']=[sum(r['values'][i] for c,r in a['rows'].items() if c.endswith('000')) for i in range(9)]
        counts(a['population'])
        for code,r in a['rows'].items():
            assert code in labels
            if not code.endswith('000'):assert code[:3]+'000' in a['rows']
        for code in groups:
            children=[r['values'] for c,r in a['rows'].items() if c.startswith(code[:3]) and c!=code]
            if children:assert [sum(c[i] for c in children) for i in range(9)]==a['rows'][code]['values'],(a['name'],code)
    state=areas['000'];assert state['population'][0]==41974218
    for code,r in state['rows'].items():
        assert [sum(a['rows'].get(code,{'values':[0]*9})['values'][i] for a in areas.values() if a['code']!='000') for i in range(9)]==r['values'],code
    assert [sum(a['population'][i] for a in areas.values() if a['code']!='000') for i in range(9)]==state['population']
    multi={};current=None;first=None
    for row,v in cells(c17):
        if v[0]!='21':continue
        if v[2]:
            current=str(v[2]).zfill(6);first=None
            assert v[4:7]==state['rows'][current]['values'][:3]
            multi[current]={'source_row':row,'population':v[4:7],'first_additional':[]}
        if v[7]:
            assert current
            first={'code':str(v[7]).zfill(6),'label':v[8].strip(),'counts':v[9:12],'source_row':row,'second_additional':[]};multi[current]['first_additional'].append(first)
        if v[12]:
            assert first is not None
            first['second_additional'].append({'code':str(v[12]).zfill(6),'label':v[13].strip(),'counts':v[14:17],'source_row':row})
    assert set(multi)==set(groups)
    for group,m in multi.items():
        m['at_least_two_languages']=[sum(f['counts'][i] for f in m['first_additional']) for i in range(3)]
        m['three_languages']=[sum(s['counts'][i] for f in m['first_additional'] for s in f['second_additional']) for i in range(3)]
        assert all(m['three_languages'][i]<=m['at_least_two_languages'][i]<=m['population'][i] for i in range(3))
        for f in m['first_additional']:
            assert f['counts'][0]==sum(f['counts'][1:])
            assert all(sum(s['counts'][i] for s in f['second_additional'])<=f['counts'][i] for i in range(3))
            for s in f['second_additional']:assert s['counts'][0]==sum(s['counts'][1:])
    profiles={'odia':{'code':'015043','note':'The individual Odia mother-tongue entry. The wider ODIA Census group also contains Sambalpuri, Desia and other entries; this grouping is a Census classification, not a judgment about community identity.'},'santali':{'code':'018040'},'kui':{'code':'070001'},'kuvi':{'code':'058006','note':'The entry explicitly labelled Kuvi, placed under KHOND/KONDH in this Census table. Do not substitute the whole group or treat this number as a count of everyone who can speak Kuvi.'},'saora':{'code':'106004','note':'The Census label is Savara. This is a source-labelled statistical connection to our Saora / Sora introduction; naming and community-preferred usage remain open to specialist review.'},'ho':{'code':'048004'},'juang':{'code':'050001'},'koya':{'code':'069002'}}
    for p in profiles.values():assert p['code'] in labels
    return {'version':1,'year':2011,'checked_on':'2026-10-01','publisher':'Office of the Registrar General & Census Commissioner, India','scope':'All state and district rows from Odisha C-16; state-level C-17. Subdistrict rows remain in the unmodified original workbook but are not served by this first atlas.','sources':{
      'c16':{'title':'C-16: Population by mother tongue, Odisha — 2011','url':'https://censusindia.gov.in/nada/index.php/catalog/10217','download':'https://censusindia.gov.in/nada/index.php/catalog/10217/download/13329/DDW-C16-STMT-MDDS-2100.XLSX','file':'references/census-2011/c16-odisha.xlsx','sha256':hashlib.sha256(c16.read_bytes()).hexdigest(),'sheet':'Sheet1'},
      'c17':{'title':'C-17: Population by bilingualism and trilingualism, Odisha — 2011','url':'https://censusindia.gov.in/nada/index.php/catalog/10283','download':'https://censusindia.gov.in/nada/index.php/catalog/10283/download/13395/DDW-C17-2100.XLSX','file':'references/census-2011/c17-odisha.xlsx','sha256':hashlib.sha256(c17.read_bytes()).hexdigest(),'sheet':'Sheet1'}},
      'fields':FIELDS,'labels':labels,'areas':areas,'multilingualism':multi,'profiles':profiles,
      'checks':{'c16_rows_inspected':len(all_rows),'state_and_district_rows':sum(len(a['rows']) for a in areas.values()),'districts':30,'state_language_groups_including_others':len(groups),'state_mother_tongue_entries':len(labels)-len(groups),'c16_state_population':41974218,'sex_and_residence_sums':'pass_all_source_rows','district_to_state_all_codes':'pass','children_to_group_where_children_listed':'pass','c17_to_c16_group_populations':'pass','additional_language_subset_checks':'pass'},
      'notes':['Figures are recorded mother-tongue returns in Census 2011, not current population estimates or counts of ethnic communities.','Language-group totals contain their mother-tongue entries. Never add a group to its children.','A language’s share of district population and a district’s share of that language’s Odisha population use different denominators.','C-17 additional-language counts apply to language groups statewide, not to a district or an individual mother-tongue entry. People reporting two additional languages are included in the at-least-two-language total.','No row for an entry in a district is displayed as not separately listed. It is not presented as a contemporary absence of speakers.','Source labels, district names and boundaries are retained from 2011. No trend, present-day boundary map or language-vitality inference is made.']}

def main():
    p=argparse.ArgumentParser();p.add_argument('--check',action='store_true');args=p.parse_args();data=build();text=json.dumps(data,ensure_ascii=False,separators=(',',':'))+'\n'
    if args.check:assert DATA.read_text()==text,'Regenerate population-2011.json'
    else:DATA.write_text(text)
    print(json.dumps(data['checks'],indent=2))
if __name__=='__main__':main()
