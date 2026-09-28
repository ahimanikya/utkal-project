"""Read this bundle's YAML frontmatter, whose values use JSON flow syntax.

General YAML is also supported when PyYAML is installed. This fallback keeps
the distributed bundle usable with standard-library Python alone.
"""
from pathlib import Path
import json

ROOT=Path(__file__).resolve().parents[2]/'kb/research'

def read_concept(path):
    raw=path.read_text(encoding='utf-8')
    if not raw.startswith('---\n'):
        raise ValueError(f'{path}: frontmatter missing')
    header, body=raw[4:].split('\n---\n',1)
    try:
        meta={}
        for line in header.splitlines():
            if not line.strip(): continue
            key,value=line.split(':',1)
            meta[key]=json.loads(value.strip())
    except (ValueError,TypeError):
        try:
            import yaml
            meta=yaml.safe_load(header)
        except ImportError as exc:
            raise ValueError('Use JSON-style values in YAML frontmatter, or install PyYAML for expanded YAML syntax.') from exc
    return meta,body.strip()

def concepts():
    for path in sorted(ROOT.rglob('*.md')):
        if path.name in {'index.md','log.md'}: continue
        meta,body=read_concept(path)
        relative=path.relative_to(ROOT).as_posix()
        yield {'id':relative[:-3],'path':relative,**meta,'body':body}
